import { LIMIT_OF_ROUND_POINTS } from "@belot/constants";
import { GameMode, Player, RoundScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  basePlayerScore,
  baseRoundScore,
  mockPlayers,
  mockPlayersScores,
  mockRoundSlice,
  mockTeamsScores,
} from "../../__mocks__/gameScoreHelpers";
import {
  calculateRoundScore,
  calculateTotalRoundScore,
  recalculateScoreOnRedo,
  recalculateScoreOnUndo,
} from "./scoreCalculationHelpers";

describe("scoreCalculationHelpers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("calculateRoundScore", () => {
    const roundPlayer: Player = mockPlayers[0];

    it("computes players scores in classic mode and clears teams scores", () => {
      const roundScore: RoundScore = baseRoundScore({
        id: 0,
        playersScores: mockPlayersScores,
        teamsScores: mockTeamsScores,
        totalRoundScore: 162,
      });

      const result = calculateRoundScore(roundScore, roundPlayer, GameMode.classic);

      expect(result.roundPlayer).toBe(roundPlayer);
      expect(result.teamsScores).toEqual([]);
      expect(result.totalRoundScore).toBe(16);
      expect(result.playersScores).toHaveLength(3);
    });

    it("computes teams scores in teams mode and clears players scores", () => {
      const roundScore: RoundScore = baseRoundScore({
        id: 0,
        playersScores: mockPlayersScores,
        teamsScores: mockTeamsScores,
        totalRoundScore: 162,
      });

      const result = calculateRoundScore(roundScore, roundPlayer, GameMode.teams);

      expect(result.roundPlayer).toBe(roundPlayer);
      expect(result.playersScores).toEqual([]);
      expect(result.totalRoundScore).toBe(16);
      expect(result.teamsScores).toHaveLength(2);
    });
  });

  describe("calculateTotalRoundScore", () => {
    const prev: RoundScore = baseRoundScore({
      id: 0,
      totalRoundScore: 200,
    });

    it("adds points when operation is plus", () => {
      const result = calculateTotalRoundScore("+", 50, prev);
      expect(result.totalRoundScore).toBe(250);
    });

    it("subtracts points when operation is not plus", () => {
      const result = calculateTotalRoundScore("-", 30, prev);
      expect(result.totalRoundScore).toBe(170);
    });

    it("caps total at the positive limit", () => {
      const result = calculateTotalRoundScore("+", LIMIT_OF_ROUND_POINTS.positive, {
        ...prev,
        totalRoundScore: LIMIT_OF_ROUND_POINTS.positive - 1,
      });
      expect(result.totalRoundScore).toBe(LIMIT_OF_ROUND_POINTS.positive);
    });

    it("floors total at the negative limit", () => {
      const result = calculateTotalRoundScore("-", 100, {
        ...prev,
        totalRoundScore: LIMIT_OF_ROUND_POINTS.negative,
      });
      expect(result.totalRoundScore).toBe(LIMIT_OF_ROUND_POINTS.negative);
    });
  });

  describe("recalculateScoreOnUndo", () => {
    const dealer = mockPlayers[2];

    const buildState = (roundsScores: RoundScore[], undoneRoundsScores: RoundScore[] = []) => ({
      ...mockRoundSlice,
      roundsScores,
      undoneRoundsScores,
      players: mockPlayers,
      dealer,
      mode: GameMode.classic as const,
    });

    it("returns unchanged slices when there is no round at index -2", () => {
      const roundsScores: RoundScore[] = [baseRoundScore({ id: 0, totalRoundScore: 100 })];
      const undoneRoundsScores: RoundScore[] = [];
      const state = buildState(roundsScores, undoneRoundsScores);

      expect(recalculateScoreOnUndo(state)).toEqual({
        roundsScores,
        undoneRoundsScores,
      });
    });

    it("uses the third-from-last round as previous when present", () => {
      const r0 = baseRoundScore({
        id: 0,
        playersScores: [
          basePlayerScore({ id: 0, playerId: 1, score: 10, totalScore: 50 }),
          basePlayerScore({ id: 1, playerId: 2, score: 0, totalScore: 40 }),
        ],
        totalRoundScore: 162,
      });
      const r1 = baseRoundScore({
        id: 1,
        playersScores: mockPlayersScores,
        totalRoundScore: 200,
      });
      const r2 = baseRoundScore({
        id: 2,
        playersScores: mockPlayersScores.map((p) => ({ ...p, score: 99 })),
        totalRoundScore: 180,
      });

      const result = recalculateScoreOnUndo(buildState([r0, r1, r2]));

      expect(result.undoneRoundsScores).toHaveLength(1);
      expect(result.undoneRoundsScores[0]).toEqual(r1);
      expect(result.roundsScores).toHaveLength(2);
      expect(result.roundsScores[0]).toEqual(r0);
      expect(result.roundsScores[1]).toMatchObject({
        id: r1.id,
        totalRoundScore: 162,
        roundPlayer: null,
      });
      expect(result.roundsScores[1].playersScores.every((p) => p.score === 0)).toBe(true);
      expect(result).toMatchObject({
        dealer: mockPlayers[1],
      });
    });

    it("builds an empty previous row when only two rounds exist", () => {
      const r0 = baseRoundScore({
        id: 0,
        playersScores: mockPlayersScores,
        totalRoundScore: 150,
      });
      const r1 = baseRoundScore({
        id: 1,
        playersScores: mockPlayersScores.map((p) => ({ ...p, score: 5 })),
        totalRoundScore: 140,
      });

      const result = recalculateScoreOnUndo(buildState([r0, r1]));

      expect(result.undoneRoundsScores).toEqual([r0]);
      expect(result.roundsScores).toHaveLength(1);
      expect(result.roundsScores[0]).toMatchObject({
        id: r0.id,
        totalRoundScore: 162,
        roundPlayer: null,
      });
      expect(result.roundsScores[0].playersScores).toHaveLength(mockPlayers.length);
      expect(result.roundsScores[0].playersScores.every((p) => p.score === 0)).toBe(true);
    });
  });

  describe("recalculateScoreOnRedo", () => {
    const dealer = mockPlayers[1];

    const buildState = (roundsScores: RoundScore[], undoneRoundsScores: RoundScore[]) => ({
      ...mockRoundSlice,
      roundsScores,
      undoneRoundsScores,
      players: mockPlayers,
      dealer,
      mode: GameMode.classic as const,
    });

    it("returns unchanged slices when nothing is undone", () => {
      const roundsScores = [
        baseRoundScore({ id: 0, totalRoundScore: 100 }),
        baseRoundScore({ id: 1, totalRoundScore: 110 }),
      ];
      const undoneRoundsScores: RoundScore[] = [];
      const state = buildState(roundsScores, undoneRoundsScores);

      expect(recalculateScoreOnRedo(state)).toEqual({
        roundsScores,
        undoneRoundsScores,
      });
    });

    it("restores the last undone round and appends a fresh empty row", () => {
      const restored = baseRoundScore({
        id: 3,
        playersScores: mockPlayersScores,
        totalRoundScore: 170,
      });
      const currentLast = baseRoundScore({
        id: 4,
        playersScores: mockPlayersScores.map((p) => ({ ...p, score: 7 })),
        totalRoundScore: 165,
      });
      const roundsScores = [
        baseRoundScore({ id: 1, totalRoundScore: 100 }),
        baseRoundScore({ id: 2, totalRoundScore: 120 }),
        currentLast,
      ];

      const result = recalculateScoreOnRedo(
        buildState(roundsScores, [restored]),
      );

      expect(result.undoneRoundsScores).toEqual([]);
      expect(result.roundsScores).toHaveLength(4);
      expect(result.roundsScores[2]).toEqual(restored);
      expect(result.roundsScores[3]).toMatchObject({
        id: restored.id + 1,
        totalRoundScore: 162,
        roundPlayer: null,
      });
      expect(result).toMatchObject({
        dealer: mockPlayers[2],
      });
    });
  });
});
