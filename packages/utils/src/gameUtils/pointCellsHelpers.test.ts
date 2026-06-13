import { describe, expect, it } from "vitest";

import { getCurrentScoreColor } from "./pointCellsHelpers";

describe("pointCellsHelpers", () => {
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

    it("returns destructive color for negative current scores", () => {
      expect(
        getCurrentScoreColor({
          score: -4,
          boltCount: 0,
          totalScore: -4,
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
            score: -4,
            boltCount: 0,
            totalScore: -4,
          },
          true,
        ),
      ).toBe("text-error-500");
    });
  });
});
