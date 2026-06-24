import { GameMode } from "@belot/types";

import PointCells from "@/components/game-table/pointCells";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@belot/hooks", () => ({
  useEffectivePointsType: () => "micropoints",
}));

vi.mock("@belot/utils/src", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/utils/src")>();
  return {
    ...actual,
    getScore: (score: { score: number }) => String(score.score),
    getCurrentScore: (score: { totalScore: number }) =>
      score.totalScore > 0 ? `+${score.totalScore}` : String(score.totalScore),
    getCurrentScoreColor: (score: { totalScore: number }) =>
      score.totalScore > 0 ? "text-success" : score.totalScore < 0 ? "text-destructive" : "",
  };
});

describe("PointCells", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders player scores in classic mode", () => {
    render(
      <table>
        <tbody>
          <tr>
            <PointCells
              gameMode={GameMode.classic}
              roundScore={{
                id: 0,
                playersScores: [
                  { id: 0, playerId: 0, score: 10, boltCount: 0, totalScore: 10 },
                  { id: 1, playerId: 1, score: -5, boltCount: 0, totalScore: -5 },
                ],
                teamsScores: [],
                totalRoundScore: 10,
              }}
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-5").length).toBeGreaterThan(0);
    expect(screen.getByText("+10")).toBeTruthy();
  });

  it("rounds three-digit micropoint total scores in teams mode", () => {
    render(
      <table>
        <tbody>
          <tr>
            <PointCells
              gameMode={GameMode.teams}
              roundScore={{
                id: 0,
                playersScores: [],
                teamsScores: [{ id: 0, teamId: 0, score: 100, boltCount: 0, totalScore: 100 }],
                totalRoundScore: 162,
              }}
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByText("16")).toBeTruthy();
  });

  it("uses neutral styling for zero current scores", () => {
    render(
      <table>
        <tbody>
          <tr>
            <PointCells
              gameMode={GameMode.classic}
              roundScore={{
                id: 0,
                playersScores: [{ id: 0, playerId: 0, score: 5, boltCount: 0, totalScore: 0 }],
                teamsScores: [],
                totalRoundScore: 5,
              }}
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("does not render current score text when score is zero", () => {
    render(
      <table>
        <tbody>
          <tr>
            <PointCells
              gameMode={GameMode.classic}
              roundScore={{
                id: 0,
                playersScores: [{ id: 0, playerId: 0, score: 0, boltCount: 0, totalScore: 7 }],
                teamsScores: [],
                totalRoundScore: 0,
              }}
            />
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.queryByTestId("current-round-score-0")).toBeNull();
  });
});
