// @vitest-environment jsdom

import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GameMode, type RoundScore } from "@belot/types";

import PlayerScoreInputWrapper from "@/components/game-table/action-buttons/next-round-button/playerScoreInputWrapper";

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: {
    players: { id: number; name: string; teamId: number }[];
    teams: { id: number; name: string; playersIds: number[] }[];
    roundsScores: RoundScore[];
    mode: GameMode;
  }) => unknown) =>
    selector({
      players: [
        { id: 0, name: "Alice", teamId: 0 },
        { id: 1, name: "Bob", teamId: 1 },
      ],
      teams: [
        { id: 0, name: "Team A", playersIds: [0] },
        { id: 1, name: "Team B", playersIds: [1] },
      ],
      roundsScores: [
        {
          id: 0,
          playersScores: [],
          teamsScores: [
            { id: 0, teamId: 0, score: 0, boltCount: 0, totalScore: 0 },
            { id: 1, teamId: 1, score: 0, boltCount: 0, totalScore: 0 },
          ],
          totalRoundScore: 0,
        },
      ],
      mode: GameMode.teams,
    }),
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/playerScoreInput", () => ({
  default: ({ opponent }: { opponent: { id: number } }) => <div>Team opponent {opponent.id}</div>,
}));

describe("PlayerScoreInputWrapper teams mode", () => {
  it("renders team opponent score inputs", () => {
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
          roundPlayer={{ id: 0, name: "Alice", teamId: 0 }}
        />
      );
    }

    render(<Harness />);

    expect(screen.getByText(/Team opponent/)).toBeTruthy();
  });
});
