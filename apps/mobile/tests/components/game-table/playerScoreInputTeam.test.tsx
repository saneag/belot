import { GameMode } from "@belot/types";

import PlayerScoreInput from "@/components/game-table/action-buttons/next-round-button/playerScoreInput";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({ nextRoundScoreForPlayer: "Score for {0}" }),
  formatLocalizationString: (msg: string, args: string[]) => `${msg}:${args[0]}`,
}));

describe("PlayerScoreInput team mode", () => {
  it("renders label for team opponents", () => {
    render(
      <PlayerScoreInput
        opponent={{ id: 0, teamId: 0, score: 0, boltCount: 0, totalScore: 0 }}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 162,
          roundPlayer: { id: 0, name: "Alice" },
        }}
        setRoundScore={vi.fn()}
        gameMode={GameMode.teams}
        players={[]}
        teams={[{ id: 0, name: "Team A", playersIds: [0] }]}
        roundPlayer={{ id: 0, name: "Alice" }}
        pointsType="micropoints"
      />,
    );

    expect(screen.getByText("Score for {0}:Team A")).toBeTruthy();
  });
});
