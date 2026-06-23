import { GameMode, type RoundScore } from "@belot/types";

import PointCells from "@/components/game-table/pointCells";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const roundScore: RoundScore = {
  id: 0,
  playersScores: [
    { id: 0, playerId: 0, score: 10, boltCount: 0, totalScore: 10 },
    { id: 1, playerId: 1, score: 20, boltCount: 0, totalScore: 20 },
  ],
  teamsScores: [],
  totalRoundScore: 162,
  roundPlayer: null,
};

describe("PointCells", () => {
  it("renders player scores in classic mode", () => {
    render(<PointCells roundScore={roundScore} gameMode={GameMode.classic} />);
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
    expect(screen.getByText("20")).toBeTruthy();
    expect(screen.getByText("16")).toBeTruthy();
  });

  it("renders team scores in teams mode", () => {
    const teamRound: RoundScore = {
      ...roundScore,
      teamsScores: [{ id: 0, teamId: 0, score: 50, boltCount: 0, totalScore: 50 }],
      totalRoundScore: 100,
    };

    render(<PointCells roundScore={teamRound} gameMode={GameMode.teams} />);
    expect(screen.getByText("50")).toBeTruthy();
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
  });

  it("formats three-digit total scores", () => {
    const threeDigit: RoundScore = { ...roundScore, totalRoundScore: 162 };
    render(<PointCells roundScore={threeDigit} gameMode={GameMode.classic} />);
    expect(screen.getAllByText("16").length).toBeGreaterThan(0);
  });
});
