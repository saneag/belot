import { LIMIT_OF_ROUND_POINTS, POINTS_TYPE } from "@belot/constants";

import { describe, expect, it } from "vitest";

import {
  formatTotalRoundScoreForDisplay,
  getDefaultRoundPoints,
  getLimitOfRoundPoints,
  getRoundPointsPresets,
  getScoreInputMaxLength,
  isMicropointsMode,
  normalizeSkippedRoundScore,
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
});
