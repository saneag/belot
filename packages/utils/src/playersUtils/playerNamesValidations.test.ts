import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Player } from "@belot/types";

vi.mock("./playerNamesHelpers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./playerNamesHelpers")>();
  return {
    ...actual,
    getPlayersNames: vi.fn(actual.getPlayersNames),
    getPlayersCount: vi.fn(actual.getPlayersCount),
  };
});

import { getPlayersCount, getPlayersNames } from "./playerNamesHelpers";
import {
  excludeChangedValue,
  isPlayerNameValid,
  isPlayersNamesEmpty,
  isPlayersNamesRepeating,
  validatePlayersNames,
} from "./playerNamesValidations";

const player = (id: number, name: string): Player => ({ id, name });

describe("playerNamesValidations", () => {
  beforeEach(async () => {
    const actual = await vi.importActual<typeof import("./playerNamesHelpers")>("./playerNamesHelpers");
    vi.mocked(getPlayersNames).mockImplementation(actual.getPlayersNames);
    vi.mocked(getPlayersCount).mockImplementation(actual.getPlayersCount);
  });

  describe("validatePlayersNames", () => {
    it("returns no issues for an empty players list", () => {
      expect(validatePlayersNames([])).toEqual({
        emptyNames: [],
        repeatingNames: [],
      });
    });

    it("returns no issues when all names are unique and non-empty", () => {
      const players = [player(1, "Ann"), player(2, "Bob"), player(3, "Cara")];
      expect(validatePlayersNames(players)).toEqual({
        emptyNames: [],
        repeatingNames: [],
      });
    });

    it("treats leading and trailing whitespace as trimmed for uniqueness and emptiness", () => {
      const players = [player(1, "  Ann  "), player(2, "Bob")];
      expect(validatePlayersNames(players)).toEqual({
        emptyNames: [],
        repeatingNames: [],
      });
    });

    it("records indices with empty or whitespace-only names", () => {
      const players = [player(1, ""), player(2, "  \t  "), player(3, "Ok")];
      expect(validatePlayersNames(players)).toEqual({
        emptyNames: ["0", "1"],
        repeatingNames: [],
      });
    });

    it("detects repeats case-insensitively and lists later indices", () => {
      const players = [player(1, "Ann"), player(2, "ANN"), player(3, "ann")];
      expect(validatePlayersNames(players)).toEqual({
        emptyNames: [],
        repeatingNames: ["1", "2"],
      });
    });

    it("can report both empty and repeating names in one list", () => {
      const players = [player(1, "x"), player(2, ""), player(3, "X"), player(4, "y")];
      expect(validatePlayersNames(players)).toEqual({
        emptyNames: ["1"],
        repeatingNames: ["2"],
      });
    });

    it("skips name entries whose index is at or beyond the reported player count", () => {
      vi.mocked(getPlayersNames).mockReturnValueOnce(["a", "b", "extra"]);
      vi.mocked(getPlayersCount).mockReturnValueOnce(2);

      expect(validatePlayersNames([player(1, "a"), player(2, "b")])).toEqual({
        emptyNames: [],
        repeatingNames: [],
      });
    });
  });

  describe("isPlayersNamesEmpty", () => {
    it("returns true when the string index is listed in emptyNames", () => {
      expect(isPlayersNamesEmpty({ emptyNames: ["0", "2"], repeatingNames: [] }, 0)).toBe(true);
    });

    it("returns false when the index is not listed", () => {
      expect(isPlayersNamesEmpty({ emptyNames: ["0"], repeatingNames: [] }, 1)).toBe(false);
    });
  });

  describe("isPlayersNamesRepeating", () => {
    it("returns true when the string index is listed in repeatingNames", () => {
      expect(isPlayersNamesRepeating({ emptyNames: [], repeatingNames: ["1"] }, 1)).toBe(true);
    });

    it("returns false when the index is not listed", () => {
      expect(isPlayersNamesRepeating({ emptyNames: [], repeatingNames: ["0"] }, 2)).toBe(false);
    });
  });

  describe("isPlayerNameValid", () => {
    it("returns true when no index is given and every validation list is empty", () => {
      expect(isPlayerNameValid({ emptyNames: [], repeatingNames: [] })).toBe(true);
    });

    it("returns false when no index is given and emptyNames is non-empty", () => {
      expect(isPlayerNameValid({ emptyNames: ["0"], repeatingNames: [] })).toBe(false);
    });

    it("returns false when no index is given and repeatingNames is non-empty", () => {
      expect(isPlayerNameValid({ emptyNames: [], repeatingNames: ["1"] })).toBe(false);
    });

    it("returns true for an index that is neither empty nor repeating", () => {
      const v = { emptyNames: ["0"], repeatingNames: ["2"] };
      expect(isPlayerNameValid(v, 1)).toBe(true);
    });

    it("returns false when the index is empty", () => {
      expect(isPlayerNameValid({ emptyNames: ["0"], repeatingNames: [] }, 0)).toBe(false);
    });

    it("returns false when the index is repeating", () => {
      expect(isPlayerNameValid({ emptyNames: [], repeatingNames: ["1"] }, 1)).toBe(false);
    });
  });

  describe("excludeChangedValue", () => {
    it("removes matching string entries from the validation list", () => {
      expect(excludeChangedValue("1", ["0", "1", "2"])).toEqual(["0", "2"]);
    });

    it("returns the same array when nothing matches", () => {
      expect(excludeChangedValue("9", ["0", "1"])).toEqual(["0", "1"]);
    });

    it("returns an empty array when given an empty list", () => {
      expect(excludeChangedValue("0", [])).toEqual([]);
    });
  });
});
