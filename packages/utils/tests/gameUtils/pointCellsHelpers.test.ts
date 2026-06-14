import { BOLT_COUNT_LIMIT, BOLT_POINTS } from "@belot/constants";

import { describe, expect, it } from "vitest";

import {
  getCurrentScore,
  getCurrentScoreColor,
  getScore,
} from "../../src/gameUtils/pointCellsHelpers";

describe("pointCellsHelpers", () => {
  describe("getScore", () => {
    it("returns bolt label when score is bolt points", () => {
      expect(
        getScore({
          score: BOLT_POINTS,
          boltCount: 2,
          totalScore: 0,
        }),
      ).toBe("BT-2");
    });

    it("returns total score for regular scores", () => {
      expect(
        getScore({
          score: 12,
          boltCount: 0,
          totalScore: 45,
        }),
      ).toBe(45);
    });
  });

  describe("getCurrentScore", () => {
    it("returns -10 when bolt count reaches the limit", () => {
      expect(
        getCurrentScore({
          score: BOLT_POINTS,
          boltCount: BOLT_COUNT_LIMIT,
          totalScore: -10,
        }),
      ).toBe("-10");
    });

    it("returns empty string for bolt scores below the limit", () => {
      expect(
        getCurrentScore({
          score: BOLT_POINTS,
          boltCount: 1,
          totalScore: 0,
        }),
      ).toBe("");
    });

    it("prefixes positive scores with plus", () => {
      expect(
        getCurrentScore({
          score: 12,
          boltCount: 0,
          totalScore: 12,
        }),
      ).toBe("+12");
    });

    it("returns negative score values as-is", () => {
      expect(
        getCurrentScore({
          score: -4,
          boltCount: 0,
          totalScore: -4,
        }),
      ).toBe(-4);
    });
  });

  describe("getCurrentScoreColor", () => {
    it("returns success color for positive current scores", () => {
      expect(
        getCurrentScoreColor({
          score: 12,
          boltCount: 0,
          totalScore: 12,
        }),
      ).toBe("text-success");
    });

    it("returns destructive color for -10 scores", () => {
      expect(
        getCurrentScoreColor({
          score: BOLT_POINTS,
          boltCount: BOLT_COUNT_LIMIT,
          totalScore: -10,
        }),
      ).toBe("text-destructive");
    });

    it("returns mobile color classes when requested", () => {
      expect(
        getCurrentScoreColor(
          {
            score: 12,
            boltCount: 0,
            totalScore: 12,
          },
          true,
        ),
      ).toBe("text-success-500");

      expect(
        getCurrentScoreColor(
          {
            score: BOLT_POINTS,
            boltCount: BOLT_COUNT_LIMIT,
            totalScore: -10,
          },
          true,
        ),
      ).toBe("text-error-500");
    });

    it("returns empty string for non-positive non-bolt scores", () => {
      expect(
        getCurrentScoreColor({
          score: -4,
          boltCount: 0,
          totalScore: -4,
        }),
      ).toBe("");
    });
  });
});
