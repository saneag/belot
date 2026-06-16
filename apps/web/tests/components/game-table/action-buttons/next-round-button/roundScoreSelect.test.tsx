// @vitest-environment jsdom

import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type RoundScore } from "@belot/types";

import RoundScoreSelect from "@/components/game-table/action-buttons/next-round-button/roundScoreSelect";

vi.mock("@belot/localizations", () => ({
  useLocalization: (_key: string, args?: unknown[]) => {
    const value = args?.[0];
    const label = typeof value === "string" || typeof value === "number" ? String(value) : "";
    return `Score:${label}`;
  },
}));

function RoundScoreSelectHarness() {
  const [roundScore, setRoundScore] = useState<RoundScore>({
    id: 0,
    playersScores: [],
    teamsScores: [],
    totalRoundScore: 0,
  });

  return (
    <RoundScoreSelect
      roundScore={roundScore}
      setRoundScore={setRoundScore}
      pointsType="micropoints"
    />
  );
}

describe("RoundScoreSelect", () => {
  it("updates round score when point buttons are clicked", () => {
    render(<RoundScoreSelectHarness />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(screen.getByText(/^Score:/)).toBeTruthy();
  });

  it("toggles operation sign", () => {
    render(<RoundScoreSelectHarness />);

    const signButtons = screen.getAllByRole("button", { name: "+" });
    fireEvent.click(signButtons[signButtons.length - 1]);

    expect(screen.getByRole("button", { name: "-" })).toBeTruthy();
  });
});
