import { BOLT_COUNT_LIMIT, BOLT_POINTS } from "@belot/constants";
import type { TeamScore } from "@belot/types";

import { describe, expect, it } from "vitest";

import { baseTeamScore, mockPlayers } from "../../__mocks__/gameScoreHelpers";
import { roundByLastDigit } from "../commonUtils";
import { calculateTeamsScore } from "./teamsScoreCalculationHelpers";

describe("teamsScoreCalculationHelpers", () => {
  describe("calculateTeamsScore", () => {
    it("applies a bolt when the round player's team scores below half of the round total (not tied)", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 30, boltCount: 0, totalScore: 100 }),
        baseTeamScore({ id: 2, teamId: 2, score: 70, boltCount: 0, totalScore: 100 }),
      ];

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 100);

      expect(result.find((t) => t.teamId === 1)).toMatchObject({
        score: BOLT_POINTS,
        boltCount: 1,
        totalScore: 100,
      });
    });

    it("resets bolt count to 1 when the declaring team already had the maximum bolt count", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({
          id: 1,
          teamId: 1,
          score: 20,
          boltCount: BOLT_COUNT_LIMIT,
          totalScore: 200,
        }),
        baseTeamScore({ id: 2, teamId: 2, score: 80, totalScore: 200 }),
      ];

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 100);

      expect(result.find((t) => t.teamId === 1)).toMatchObject({
        score: BOLT_POINTS,
        boltCount: 1,
        totalScore: 200,
      });
    });

    it("subtracts 10 from total when a new bolt reaches the bolt count limit", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({
          id: 1,
          teamId: 1,
          score: 20,
          boltCount: BOLT_COUNT_LIMIT - 1,
          totalScore: 150,
        }),
        baseTeamScore({ id: 2, teamId: 2, score: 80, totalScore: 150 }),
      ];

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 100);

      expect(result.find((t) => t.teamId === 1)).toMatchObject({
        score: BOLT_POINTS,
        boltCount: BOLT_COUNT_LIMIT,
        totalScore: 140,
      });
    });

    it("awards rounded total round points to the opposing team when they beat half the round total", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 30, totalScore: 50 }),
        baseTeamScore({ id: 2, teamId: 2, score: 70, totalScore: 50 }),
      ];
      const totalRoundScore = 100;
      const roundedTotal = roundByLastDigit(totalRoundScore);

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], totalRoundScore);

      expect(result.find((t) => t.teamId === 2)).toMatchObject({
        score: roundedTotal,
        totalScore: 50 + roundedTotal,
      });
    });

    it("applies -10 when a team has zero points after other rules do not apply", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 100, totalScore: 200 }),
        baseTeamScore({ id: 2, teamId: 2, score: 0, totalScore: 200 }),
      ];

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 100);

      expect(result.find((t) => t.teamId === 2)).toMatchObject({
        score: -10,
        totalScore: 190,
      });
    });

    it("applies -10 for zero score when the round total is zero (tie at half)", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 0, totalScore: 10 }),
        baseTeamScore({ id: 2, teamId: 2, score: 0, totalScore: 10 }),
      ];

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 0);

      expect(result.every((t) => t.score === -10 && t.totalScore === 0)).toBe(true);
    });

    it("uses roundByLastDigit for the default path when the declaring team wins or ties above half", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 72, totalScore: 300 }),
        baseTeamScore({ id: 2, teamId: 2, score: 28, totalScore: 300 }),
      ];
      const raw = 72;
      const rounded = roundByLastDigit(raw);

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 100);

      expect(result.find((t) => t.teamId === 1)).toMatchObject({
        score: rounded,
        totalScore: 300 + rounded,
      });
    });

    it("uses roundByLastDigit when scores are tied at exactly half of the round total", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 50, totalScore: 100 }),
        baseTeamScore({ id: 2, teamId: 2, score: 50, totalScore: 100 }),
      ];
      const rounded = roundByLastDigit(50);

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], 100);

      expect(result).toEqual([
        expect.objectContaining({ teamId: 1, score: rounded, totalScore: 100 + rounded }),
        expect.objectContaining({ teamId: 2, score: rounded, totalScore: 100 + rounded }),
      ]);
    });

    it("treats every team as non-own when roundPlayer is null, using opponent-win and default paths", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 70, totalScore: 100 }),
        baseTeamScore({ id: 2, teamId: 2, score: 30, totalScore: 100 }),
      ];
      const totalRoundScore = 100;
      const roundedWin = roundByLastDigit(totalRoundScore);
      const roundedLoser = roundByLastDigit(30);

      const result = calculateTeamsScore(teamsScores, null, totalRoundScore);

      expect(result.find((t) => t.teamId === 1)).toMatchObject({
        score: roundedWin,
        totalScore: 100 + roundedWin,
      });
      expect(result.find((t) => t.teamId === 2)).toMatchObject({
        score: roundedLoser,
        totalScore: 100 + roundedLoser,
      });
    });

    it("maps each team independently so one team can be bolted while the other is rewarded", () => {
      const teamsScores: TeamScore[] = [
        baseTeamScore({ id: 1, teamId: 1, score: 25, boltCount: 0, totalScore: 80 }),
        baseTeamScore({ id: 2, teamId: 2, score: 75, totalScore: 80 }),
      ];
      const totalRoundScore = 100;
      const roundedTotal = roundByLastDigit(totalRoundScore);

      const result = calculateTeamsScore(teamsScores, mockPlayers[0], totalRoundScore);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        teamId: 1,
        score: BOLT_POINTS,
        boltCount: 1,
      });
      expect(result[1]).toMatchObject({
        teamId: 2,
        score: roundedTotal,
        totalScore: 80 + roundedTotal,
      });
    });
  });
});
