import { LIMIT_OF_ROUND_POINTS, POINTS_TYPE } from "@belot/constants";

import { describe, expect, it } from "vitest";

import { NEXT_WINNING_STEP, WIN_POINTS } from "@belot/constants";

import {
  formatTotalRoundScoreForDisplay,
  formatRoundPointPresetForDisplay,
  getDefaultRoundPoints,
  getLimitOfRoundPoints,
  getNextWinningStep,
  getRoundPointsPresets,
  getScoreInputMaxLength,
  getWinPoints,
  isMicropointsMode,
  normalizeSkippedRoundScore,
  convertRoundScoreForPointsType,
} from "../src/pointsTypeHelpers";

describe("pointsTypeHelpers", () => {
  describe("isMicropointsMode", () => {
    it("returns true for micropoints type", () => {
      expect(isMicropointsMode(POINTS_TYPE[0].id)).toBe(true);
    });

    it("returns false for points type", () => {
      expect(isMicropointsMode(POINTS_TYPE[1].id)).toBe(false);
    });
  });

  describe("getDefaultRoundPoints", () => {
    it("returns 162 for micropoints", () => {
      expect(getDefaultRoundPoints(POINTS_TYPE[0].id)).toBe(162);
    });

    it("returns 16 for points", () => {
      expect(getDefaultRoundPoints(POINTS_TYPE[1].id)).toBe(16);
    });
  });

  describe("getLimitOfRoundPoints", () => {
    it("returns micropoint limits for micropoints mode", () => {
      expect(getLimitOfRoundPoints(POINTS_TYPE[0].id)).toEqual(LIMIT_OF_ROUND_POINTS);
    });

    it("returns point limits for points mode", () => {
      expect(getLimitOfRoundPoints(POINTS_TYPE[1].id)).toEqual({
        positive: 57,
        negative: 16,
      });
    });
  });

  describe("getRoundPointsPresets", () => {
    it("returns micropoint presets for micropoints mode", () => {
      expect(getRoundPointsPresets(POINTS_TYPE[0].id)).toEqual([20, 50, 100, 150, 200]);
    });

    it("returns point presets for points mode", () => {
      expect(getRoundPointsPresets(POINTS_TYPE[1].id)).toEqual([2, 5, 10, 15, 20]);
    });
  });

  describe("formatRoundPointPresetForDisplay", () => {
    it("shows decimal labels for micropoint preset values", () => {
      expect(formatRoundPointPresetForDisplay(20, POINTS_TYPE[0].id)).toBe(2);
      expect(formatRoundPointPresetForDisplay(100, POINTS_TYPE[0].id)).toBe(10);
    });

    it("shows point preset values as-is in points mode", () => {
      expect(formatRoundPointPresetForDisplay(2, POINTS_TYPE[1].id)).toBe(2);
      expect(formatRoundPointPresetForDisplay(10, POINTS_TYPE[1].id)).toBe(10);
    });
  });

  describe("getWinPoints", () => {
    it("returns 101 regardless of points type", () => {
      expect(getWinPoints()).toBe(WIN_POINTS);
    });
  });

  describe("getNextWinningStep", () => {
    it("returns 50 regardless of points type", () => {
      expect(getNextWinningStep()).toBe(NEXT_WINNING_STEP);
    });
  });

  describe("getScoreInputMaxLength", () => {
    it("returns 3 for micropoints", () => {
      expect(getScoreInputMaxLength(POINTS_TYPE[0].id)).toBe(3);
    });

    it("returns 2 for points", () => {
      expect(getScoreInputMaxLength(POINTS_TYPE[1].id)).toBe(2);
    });
  });

  describe("formatTotalRoundScoreForDisplay", () => {
    it("converts three-digit micropoint values for display", () => {
      expect(formatTotalRoundScoreForDisplay(162, POINTS_TYPE[0].id)).toBe(16);
    });

    it("returns point values as-is in points mode", () => {
      expect(formatTotalRoundScoreForDisplay(16, POINTS_TYPE[1].id)).toBe(16);
    });
  });

  describe("normalizeSkippedRoundScore", () => {
    it("rounds micropoint values when skipping a round", () => {
      expect(normalizeSkippedRoundScore(162, POINTS_TYPE[0].id)).toBe(16);
    });

    it("keeps point values unchanged when skipping a round", () => {
      expect(normalizeSkippedRoundScore(16, POINTS_TYPE[1].id)).toBe(16);
    });
  });

  describe("convertRoundScoreForPointsType", () => {
    it("converts micropoint round scores to points", () => {
      expect(
        convertRoundScoreForPointsType(
          {
            id: 0,
            roundPlayer: null,
            totalRoundScore: 162,
            playersScores: [{ id: 0, playerId: 0, score: 50, boltCount: 0, totalScore: 0 }],
            teamsScores: [],
          },
          POINTS_TYPE[0].id,
          POINTS_TYPE[1].id,
        ),
      ).toMatchObject({
        totalRoundScore: 16,
        playersScores: [{ score: 5 }],
      });
    });

    it("converts point round scores to micropoints", () => {
      expect(
        convertRoundScoreForPointsType(
          {
            id: 0,
            roundPlayer: null,
            totalRoundScore: 16,
            playersScores: [{ id: 0, playerId: 0, score: 5, boltCount: 0, totalScore: 0 }],
            teamsScores: [],
          },
          POINTS_TYPE[1].id,
          POINTS_TYPE[0].id,
        ),
      ).toMatchObject({
        totalRoundScore: 162,
        playersScores: [{ score: 50 }],
      });
    });
  });
});
