// @vitest-environment jsdom

import { GameMode, type RoundScore } from "@belot/types";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PointCells from "@/components/game-table/pointCells";

describe("PointCells branches", () => {
  it("shows current score overlay when score has bolt count", () => {
    const roundScore: RoundScore = {
      id: 0,
      playersScores: [
        { id: 0, playerId: 0, score: 10, boltCount: 1, totalScore: 10 },
        { id: 1, playerId: 1, score: 0, boltCount: 0, totalScore: 0 },
      ],
      teamsScores: [],
      totalRoundScore: 50,
      roundPlayer: null,
    };

    render(<PointCells roundScore={roundScore} gameMode={GameMode.classic} />);
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
    expect(screen.getByText("+10")).toBeTruthy();
  });

  it("renders two-digit total scores without decimal conversion", () => {
    const roundScore: RoundScore = {
      id: 0,
      playersScores: [
        { id: 0, playerId: 0, score: 5, boltCount: 0, totalScore: 5 },
      ],
      teamsScores: [],
      totalRoundScore: 50,
      roundPlayer: null,
    };

    render(<PointCells roundScore={roundScore} gameMode={GameMode.classic} />);
    expect(screen.getAllByText("50").length).toBeGreaterThan(0);
  });
});
