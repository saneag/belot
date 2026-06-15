// @vitest-environment jsdom

import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GameMode, type Player, type RoundScore } from "@belot/types";

import PlayerScoreInputWrapper from "@/components/game-table/action-buttons/next-round-button/playerScoreInputWrapper";

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: {
    players: Player[];
    teams: [];
    roundsScores: RoundScore[];
    mode: GameMode;
  }) => unknown) =>
    selector({
      players: [
        { id: 0, name: "Alice" },
        { id: 1, name: "Bob" },
      ],
      teams: [],
      roundsScores: [
        {
          id: 0,
          playersScores: [
            { id: 0, playerId: 0, score: 0, boltCount: 0, totalScore: 0 },
            { id: 1, playerId: 1, score: 0, boltCount: 0, totalScore: 0 },
          ],
          teamsScores: [],
          totalRoundScore: 0,
        },
      ],
      mode: GameMode.classic,
    }),
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/playerScoreInput", () => ({
  default: ({ opponent }: { opponent: { id: number } }) => <div>Opponent {opponent.id}</div>,
}));

describe("PlayerScoreInputWrapper", () => {
  it("renders opponent score inputs", () => {
    function Harness() {
      const [roundScore, setRoundScore] = useState<RoundScore>({
        id: 1,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 0,
      });

      return (
        <PlayerScoreInputWrapper
          roundScore={roundScore}
          setRoundScore={setRoundScore}
          roundPlayer={{ id: 0, name: "Alice" }}
          pointsType="micropoints"
        />
      );
    }

    render(<Harness />);

    expect(screen.getByText("Opponent 1")).toBeTruthy();
  });
});
