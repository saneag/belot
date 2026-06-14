import type { Player, Team } from "@belot/types";

import { describe, expect, it } from "vitest";

import {
  getPlayersCount,
  getPlayersNames,
  getRightPosition,
  getRotation,
  getTeamsNames,
  getTopPosition,
} from "../../src/playersUtils/playerNamesHelpers";

describe("playerNamesHelpers", () => {
  describe("getPlayersCount", () => {
    it("returns 0 for an empty players array", () => {
      expect(getPlayersCount([])).toBe(0);
    });

    it("returns the number of players", () => {
      const players: Player[] = [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ];
      expect(getPlayersCount(players)).toBe(2);
    });
  });

  describe("getPlayersNames", () => {
    it("returns an empty array when there are no players", () => {
      expect(getPlayersNames([])).toEqual([]);
    });

    it("maps each player to their name", () => {
      const players: Player[] = [
        { id: 1, name: "North" },
        { id: 2, name: "East" },
      ];
      expect(getPlayersNames(players)).toEqual(["North", "East"]);
    });
  });

  describe("getTeamsNames", () => {
    it("returns an empty array when there are no teams", () => {
      expect(getTeamsNames([])).toEqual([]);
    });

    it("maps each team to their name", () => {
      const teams: Team[] = [
        { id: 1, name: "Team A", playersIds: [1, 2] },
        { id: 2, name: "Team B", playersIds: [3, 4] },
      ];
      expect(getTeamsNames(teams)).toEqual(["Team A", "Team B"]);
    });
  });

  describe("getTopPosition", () => {
    it("returns layout positions for supported player counts", () => {
      expect(getTopPosition({ index: 0, playersCount: 2, isError: false })).toBe(-45);
      expect(getTopPosition({ index: 1, playersCount: 2, isError: false })).toBe(205);
      expect(getTopPosition({ index: 1, playersCount: 3, isError: true })).toBe(82.5);
      expect(getTopPosition({ index: 3, playersCount: 4, isError: false })).toBe(92.5);
    });

    it("returns auto for unsupported layouts", () => {
      expect(getTopPosition({ index: 0, playersCount: 5, isError: false })).toBe("auto");
    });
  });

  describe("getRightPosition", () => {
    it("returns layout positions for supported player counts", () => {
      expect(getRightPosition({ index: 0, playersCount: 2, isError: false })).toBe(0);
      expect(getRightPosition({ index: 1, playersCount: 3, isError: false })).toBe(-90);
      expect(getRightPosition({ index: 1, playersCount: 3, isError: true })).toBe(-80);
      expect(getRightPosition({ index: 3, playersCount: 4, isError: false })).toBe(95);
    });

    it("returns auto for unsupported layouts", () => {
      expect(getRightPosition({ index: 0, playersCount: 1, isError: false })).toBe("auto");
    });
  });

  describe("getRotation", () => {
    it("returns css rotation strings for table layouts", () => {
      expect(getRotation({ index: 1, playersCount: 3, isObjectRotation: false })).toBe(
        "rotateZ(90deg)",
      );
      expect(getRotation({ index: 3, playersCount: 4, isObjectRotation: false })).toBe(
        "rotateZ(-90deg)",
      );
    });

    it("returns object rotations for mobile layouts", () => {
      expect(getRotation({ index: 1, playersCount: 3, isObjectRotation: true })).toEqual([
        { rotateZ: "90deg" },
      ]);
      expect(getRotation({ index: 3, playersCount: 4, isObjectRotation: true })).toEqual([
        { rotateZ: "-90deg" },
      ]);
    });

    it("returns empty values for unsupported layouts", () => {
      expect(getRotation({ index: 0, playersCount: 2, isObjectRotation: false })).toBe("");
      expect(getRotation({ index: 0, playersCount: 2, isObjectRotation: true })).toEqual([]);
      expect(getRotation({ index: 0, playersCount: 5, isObjectRotation: false })).toBe("");
    });
  });
});
