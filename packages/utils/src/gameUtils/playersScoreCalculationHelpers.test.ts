import { BOLT_COUNT_LIMIT, BOLT_POINTS, DEFAULT_ROUND_POINTS } from "@belot/constants";
import { Player, PlayerScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { basePlayerScore, mockPlayers, mockPlayersScores } from "../../__mocks__/gameScoreHelpers";
import {
  calculatePlayersScores,
  calculatePlayersScoresHelper,
  sumOpponentPlayersScores,
} from "./playersScoreCalculationHelpers";

describe("playersScoreCalculationHelpers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("calculatePlayersScoresHelper", () => {
    it("should return the calculated players scores when shouldRoundScore is true", () => {
      const result = calculatePlayersScoresHelper(
        mockPlayersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        true,
      );

      expect(result).toEqual([
        {
          ...mockPlayersScores[0],
          score: 8,
          totalScore: 8,
        },
        {
          ...mockPlayersScores[1],
          score: 3,
          totalScore: 3,
        },
        {
          ...mockPlayersScores[2],
          score: 5,
          totalScore: 5,
        },
      ]);
    });

    it("should use roundByLastDigit for the round player when shouldRoundScore is false and they win", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 30 }),
        basePlayerScore({ id: 2, playerId: 2, score: 45 }),
        basePlayerScore({ id: 3, playerId: 3, score: 56 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        false,
      );

      expect(result.find((p) => p.playerId === 1)).toMatchObject({
        score: 6,
        totalScore: 6,
      });
    });

    it("should apply a bolt to the round player when their share is below the highest opponent rounded score", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 10, boltCount: 0, totalScore: 100 }),
        basePlayerScore({ id: 2, playerId: 2, score: 95 }),
        basePlayerScore({ id: 3, playerId: 3, score: 11 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        true,
      );

      expect(result.find((p) => p.playerId === 1)).toMatchObject({
        score: BOLT_POINTS,
        boltCount: 1,
        totalScore: 100,
      });
    });

    it("should reset bolt count to 1 when the round player already reached the bolt limit", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({
          id: 1,
          playerId: 1,
          score: 10,
          boltCount: BOLT_COUNT_LIMIT,
          totalScore: 200,
        }),
        basePlayerScore({ id: 2, playerId: 2, score: 95 }),
        basePlayerScore({ id: 3, playerId: 3, score: 11 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        true,
      );

      expect(result.find((p) => p.playerId === 1)).toEqual({
        ...playersScores[0],
        score: BOLT_POINTS,
        boltCount: 1,
        totalScore: 200,
      });
    });

    it("should subtract 10 from totalScore when the bolt count reaches the limit after increment", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({
          id: 1,
          playerId: 1,
          score: 10,
          boltCount: BOLT_COUNT_LIMIT - 1,
          totalScore: 150,
        }),
        basePlayerScore({ id: 2, playerId: 2, score: 95 }),
        basePlayerScore({ id: 3, playerId: 3, score: 11 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        true,
      );

      expect(result.find((p) => p.playerId === 1)).toMatchObject({
        score: BOLT_POINTS,
        boltCount: BOLT_COUNT_LIMIT,
        totalScore: 140,
      });
    });

    it("should split bolt points across opponents tied for the highest rounded score with remainder favoring earlier ids", () => {
      const roundPlayer: Player = { id: 1, name: "P1", teamId: 1 };
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 10, totalScore: 0 }),
        basePlayerScore({ id: 2, playerId: 2, score: 56, totalScore: 0 }),
        basePlayerScore({ id: 3, playerId: 3, score: 56, totalScore: 0 }),
        basePlayerScore({ id: 4, playerId: 4, score: 15, totalScore: 0 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        roundPlayer,
        DEFAULT_ROUND_POINTS,
        true,
      );

      const p2 = result.find((p) => p.playerId === 2)!;
      const p3 = result.find((p) => p.playerId === 3)!;
      expect(p2.score).toBe(8);
      expect(p3.score).toBe(7);
    });

    it("should use roundByLastDigit on bolted opponent totals when shouldRoundScore is false", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 10, totalScore: 0 }),
        basePlayerScore({ id: 2, playerId: 2, score: 95, totalScore: 0 }),
        basePlayerScore({ id: 3, playerId: 3, score: 11, totalScore: 0 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        false,
      );

      expect(result.find((p) => p.playerId === 2)).toMatchObject({ score: 15, totalScore: 15 });
      expect(result.find((p) => p.playerId === 3)).toMatchObject({ score: 1, totalScore: 1 });
    });

    it("should set score to -10 when a non-round player has a rounded score of zero", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 80, totalScore: 0 }),
        basePlayerScore({ id: 2, playerId: 2, score: 3, totalScore: 50 }),
        basePlayerScore({ id: 3, playerId: 3, score: 79, totalScore: 0 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        true,
      );

      expect(result.find((p) => p.playerId === 2)).toMatchObject({
        score: -10,
        totalScore: 40,
        boltCount: 0,
      });
    });

    it("should treat shared bolt split as zero when there are no opponents besides the round player", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 80, totalScore: 40 }),
      ];

      const result = calculatePlayersScoresHelper(
        playersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
        true,
      );

      expect(result).toEqual([
        {
          ...playersScores[0],
          score: 16,
          totalScore: 56,
        },
      ]);
    });
  });

  describe("calculatePlayersScores", () => {
    it("should recompute without per-player rounding when the round player ties an opponent on rounded scores", () => {
      const playersScores: PlayerScore[] = [
        basePlayerScore({ id: 1, playerId: 1, score: 30, totalScore: 0 }),
        basePlayerScore({ id: 2, playerId: 2, score: 45, totalScore: 0 }),
        basePlayerScore({ id: 3, playerId: 3, score: 56, totalScore: 0 }),
      ];

      const result = calculatePlayersScores(playersScores, mockPlayers[0], DEFAULT_ROUND_POINTS);

      expect(result.find((p) => p.playerId === 1)?.score).toBe(6);
      expect(result.find((p) => p.playerId === 2)?.score).toBe(4);
      expect(result.find((p) => p.playerId === 3)?.score).toBe(6);
    });

    it("should return rounded scores directly when there is no tie on rounded scores", () => {
      const result = calculatePlayersScores(
        mockPlayersScores,
        mockPlayers[0],
        DEFAULT_ROUND_POINTS,
      );

      expect(result).toEqual(
        calculatePlayersScoresHelper(mockPlayersScores, mockPlayers[0], DEFAULT_ROUND_POINTS, true),
      );
    });
  });

  describe("sumOpponentPlayersScores", () => {
    const roundScore = {
      playersScores: mockPlayersScores,
      totalRoundScore: DEFAULT_ROUND_POINTS,
    };

    it("should subtract summed opponent rounded scores from rounded total when shouldRoundScore is true", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore,
          roundPlayer: mockPlayers[0],
          shouldRoundScore: true,
        }),
      ).toBe(8);
    });

    it("should subtract summed raw opponent scores from total when shouldRoundScore is false", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore,
          roundPlayer: mockPlayers[0],
          shouldRoundScore: false,
        }),
      ).toBe(72);
    });

    it("should return the sum of opponent scores when totalRoundScore is missing", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore: { playersScores: mockPlayersScores, totalRoundScore: 0 },
          roundPlayer: mockPlayers[0],
          shouldRoundScore: true,
        }),
      ).toBe(8);
    });

    it("should exclude the current opponent when their id matches a player score row", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore,
          roundPlayer: mockPlayers[0],
          currentOpponent: mockPlayersScores[1],
          shouldRoundScore: true,
        }),
      ).toBe(11);
    });

    it("should exclude the current opponent when their id matches a team score row", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore,
          roundPlayer: mockPlayers[0],
          currentOpponent: { id: 2, teamId: 2, score: 0, boltCount: 0, totalScore: 0 },
          shouldRoundScore: true,
        }),
      ).toBe(11);
    });

    it("should include all player rows in the sum when roundPlayer is null", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore,
          roundPlayer: null,
          shouldRoundScore: true,
        }),
      ).toBe(1);
    });

    it("should use raw opponent scores when shouldRoundScore is omitted", () => {
      expect(
        sumOpponentPlayersScores({
          roundScore,
          roundPlayer: mockPlayers[0],
        }),
      ).toBe(72);
    });
  });
});
