// @vitest-environment jsdom

import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Player, type RoundScore } from "@belot/types";

import ScoreDialogContent from "@/components/game-table/action-buttons/next-round-button/scoreDialogContent";

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({ nextRoundScoreForPlayerInputHelper: "Helper text" }),
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/roundPlayerSelect", () => ({
  default: () => <div>Select player</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/roundPlayerDisplay", () => ({
  default: () => <div>Selected player</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/roundScoreSelect", () => ({
  default: () => <div>Score select</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/playerScoreInputWrapper", () => ({
  default: () => <div>Score inputs</div>,
}));

describe("ScoreDialogContent", () => {
  it("renders player select when no round player is chosen", () => {
    const setRoundPlayer = vi.fn();
    const setRoundScore = vi.fn();

    render(
      <ScoreDialogContent
        roundPlayer={null}
        setRoundPlayer={setRoundPlayer}
        roundScore={{ id: 0, playersScores: [], teamsScores: [], totalRoundScore: 0 }}
        setRoundScore={setRoundScore}
      />,
    );

    expect(screen.getByText("Select player")).toBeTruthy();
  });

  it("renders score inputs when round player is chosen", () => {
    function Harness() {
      const [roundPlayer, setRoundPlayer] = useState<Player | null>({ id: 0, name: "Alice" });
      const [roundScore, setRoundScore] = useState<RoundScore>({
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 0,
      });

      return (
        <ScoreDialogContent
          roundPlayer={roundPlayer}
          setRoundPlayer={setRoundPlayer}
          roundScore={roundScore}
          setRoundScore={setRoundScore}
        />
      );
    }

    render(<Harness />);

    expect(screen.getByText("Selected player")).toBeTruthy();
    expect(screen.getByText("Score select")).toBeTruthy();
    expect(screen.getByText("* Helper text")).toBeTruthy();
  });
});
