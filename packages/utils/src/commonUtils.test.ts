import { describe, expect, it } from "vitest";

import { removeNthElementFromEnd, roundByLastDigit, roundToDecimal } from "./commonUtils";

describe("commonUtils", () => {
  describe("roundByLastDigit", () => {
    it("rounds down when the last digit is 0 through 5", () => {
      expect(roundByLastDigit(40)).toBe(4);
      expect(roundByLastDigit(45)).toBe(4);
      expect(roundByLastDigit(55)).toBe(5);
    });

    it("rounds up when the last digit is 6 through 9", () => {
      expect(roundByLastDigit(46)).toBe(5);
      expect(roundByLastDigit(59)).toBe(6);
    });
  });

  describe("roundToDecimal", () => {
    it("floors the value divided by 10", () => {
      expect(roundToDecimal(0)).toBe(0);
      expect(roundToDecimal(99)).toBe(9);
      expect(roundToDecimal(100)).toBe(10);
      expect(roundToDecimal(-17)).toBe(-2);
    });
  });

  describe("removeNthElementFromEnd", () => {
    it("returns the array unchanged when its length is less than the index", () => {
      const arr = [1, 2];
      expect(removeNthElementFromEnd(arr, 3)).toEqual([1, 2]);
      expect(removeNthElementFromEnd([], 1)).toEqual([]);
    });

    it("removes the nth element from the end when length is at least the index", () => {
      expect(removeNthElementFromEnd([1, 2, 3, 4], 1)).toEqual([1, 2, 3]);
      expect(removeNthElementFromEnd([1, 2, 3, 4], 2)).toEqual([1, 2, 4]);
      expect(removeNthElementFromEnd(["a", "b", "c"], 3)).toEqual(["b", "c"]);
    });
  });
});
