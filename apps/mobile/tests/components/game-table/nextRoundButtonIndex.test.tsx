// @vitest-environment jsdom

import { useState } from "react";

import { type Player, type Team } from "@belot/types";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NextRoundButton from "@/components/game-table/action-buttons/next-round-button";

vi.mock("@belot/hooks", () => ({
  useHandleNextRound: () => ({
    handleNextRound: vi.fn(),
    handleCancel: vi.fn(),
    handleDialogOpen: vi.fn((show: () => void) => show()),
    roundPlayer: { id: 0, name: "Alice" },
    roundScore: {
      id: 0,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 0,
      roundPlayer: null,
    },
    setRoundPlayer: vi.fn(),
    setRoundScore: vi.fn(),
  }),
  useHandleConfirmationDialog: ({
    visible,
    setVisible,
  }: {
    visible?: boolean;
    setVisible?: (v: boolean) => void;
  }) => ({
    isVisible: visible ?? false,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: (cb?: () => void) => {
      cb?.();
      setVisible?.(true);
    },
    hideDialog: () => setVisible?.(false),
    handleDialogCancel: () => setVisible?.(false),
    handleDialogConfirmation: vi.fn(),
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    nextRoundTitle: "Next round",
    nextRoundButton: "Next",
  }),
}));

describe("NextRoundButton", () => {
  it("opens next round dialog", () => {
    function Wrapper() {
      const [, setWinner] = useState<Player | Team | null>(null);
      return <NextRoundButton setWinner={setWinner} />;
    }

    render(<Wrapper />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Next round")).toBeTruthy();
  });
});
