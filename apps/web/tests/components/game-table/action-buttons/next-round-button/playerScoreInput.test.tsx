import { useState } from "react";

import { GameMode, type RoundScore, type Team } from "@belot/types";

import PlayerScoreInput from "@/components/game-table/action-buttons/next-round-button/playerScoreInput";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@belot/localizations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/localizations")>();
  return {
    ...actual,
    useLocalizations: () => ({ nextRoundScoreForPlayer: "Score for {0}" }),
  };
});

describe("PlayerScoreInput", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders opponent score input and handles changes", () => {
    function Harness() {
      const [roundScore, setRoundScore] = useState<RoundScore>({
        id: 0,
        playersScores: [{ id: 0, playerId: 1, score: 0, boltCount: 0, totalScore: 0 }],
        teamsScores: [],
        totalRoundScore: 0,
      });

      return (
        <PlayerScoreInput
          opponent={{ id: 0, playerId: 1, score: 0, boltCount: 0, totalScore: 0 }}
          roundScore={roundScore}
          setRoundScore={setRoundScore}
          gameMode={GameMode.classic}
          players={[
            { id: 0, name: "Alice" },
            { id: 1, name: "Bob" },
          ]}
          teams={[]}
          roundPlayer={{ id: 0, name: "Alice" }}
          pointsType="micropoints"
        />
      );
    }

    render(<Harness />);

    const input = screen.getByRole<HTMLInputElement>("spinbutton");
    expect(screen.getByText("Score for Bob")).toBeTruthy();

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.focus(input);

    expect(input.value).toBe("0");
  });

  it("renders team score label in teams mode", () => {
    function Harness() {
      const [roundScore, setRoundScore] = useState<RoundScore>({
        id: 0,
        playersScores: [],
        teamsScores: [{ id: 0, teamId: 1, score: 0, boltCount: 0, totalScore: 0 }],
        totalRoundScore: 0,
      });

      return (
        <PlayerScoreInput
          opponent={{ id: 0, teamId: 1, score: 0, boltCount: 0, totalScore: 0 }}
          roundScore={roundScore}
          setRoundScore={setRoundScore}
          gameMode={GameMode.teams}
          players={[]}
          teams={[{ id: 1, name: "Team B", playersIds: [0, 1] }] as Team[]}
          roundPlayer={{ id: 0, name: "Alice" }}
          pointsType="micropoints"
        />
      );
    }

    render(<Harness />);

    expect(screen.getByText("Score for Team B")).toBeTruthy();
  });

  it("uses zero when there is no matching score row", () => {
    render(
      <PlayerScoreInput
        opponent={{ id: 99, playerId: 99, score: 0, boltCount: 0, totalScore: 0 }}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 0,
        }}
        setRoundScore={vi.fn()}
        gameMode={GameMode.classic}
        players={[]}
        teams={[]}
        roundPlayer={null}
        pointsType="micropoints"
      />,
    );

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("0");
  });
});
