import { GameMode } from "@belot/types";

import PlayerScoreInput from "@/components/game-table/action-buttons/next-round-button/playerScoreInput";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({ nextRoundScoreForPlayer: "Score for {0}" }),
  formatLocalizationString: (msg: string, args: string[]) => `${msg}:${args[0]}`,
}));

describe("PlayerScoreInput", () => {
  it("updates score on input change", () => {
    const setRoundScore = vi.fn();

    render(
      <PlayerScoreInput
        opponent={{ id: 0, playerId: 1, score: 0, boltCount: 0, totalScore: 0 }}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 162,
          roundPlayer: { id: 0, name: "Alice" },
        }}
        setRoundScore={setRoundScore}
        gameMode={GameMode.classic}
        players={[
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ]}
        teams={[]}
        roundPlayer={{ id: 0, name: "Alice" }}
        pointsType="micropoints"
      />,
    );

    expect(screen.getByText("Score for {0}:Bob")).toBeTruthy();
    fireEvent.change(screen.getByDisplayValue("0"), { target: { value: "25" } });
    expect(setRoundScore).toHaveBeenCalled();
  });

  it("skips auto-update when total round score is zero", () => {
    const setRoundScore = vi.fn();

    render(
      <PlayerScoreInput
        opponent={{ id: 0, playerId: 1, score: 0, boltCount: 0, totalScore: 0 }}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 0,
          roundPlayer: { id: 0, name: "Alice" },
        }}
        setRoundScore={setRoundScore}
        gameMode={GameMode.classic}
        players={[
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ]}
        teams={[]}
        roundPlayer={{ id: 0, name: "Alice" }}
        pointsType="micropoints"
      />,
    );

    expect(setRoundScore).not.toHaveBeenCalled();
  });
});
