// @vitest-environment jsdom

import { GameMode } from "@belot/types";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  reset: vi.fn(),
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ replace: mocks.replace, push: vi.fn(), back: vi.fn() }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    winDialogTitlePlayer: "Player wins",
    winDialogTitleTeam: "Team wins",
    winDialogContent: "Congrats",
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { mode: GameMode; reset: () => void }) => unknown) =>
    selector({ mode: GameMode.classic, reset: mocks.reset }),
}));

vi.mock("@belot/hooks", () => ({
  useHandleConfirmationDialog: ({
    visible,
    setVisible,
    cancelCallback,
    confirmationCallback,
  }: {
    visible?: boolean;
    setVisible?: (v: boolean) => void;
    cancelCallback?: () => void;
    confirmationCallback?: () => void;
  }) => ({
    isVisible: visible ?? false,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: vi.fn(),
    hideDialog: () => setVisible?.(false),
    handleDialogCancel: () => {
      cancelCallback?.();
      setVisible?.(false);
    },
    handleDialogConfirmation: () => {
      confirmationCallback?.();
      setVisible?.(false);
    },
  }),
}));

describe("WinDialog reset flow", () => {
  it("resets game on confirm", async () => {
    const setWinner = vi.fn();
    const { default: WinDialog } = await import("@/components/game-table/winDialog");

    render(<WinDialog winner={{ id: 0, name: "Alice" }} setWinner={setWinner} />);

    fireEvent.click(screen.getByText("Confirm"));
    expect(mocks.reset).toHaveBeenCalled();
    expect(setWinner).toHaveBeenCalledWith(null);
    expect(mocks.replace).toHaveBeenCalledWith("/starting-screen");
  });
});
