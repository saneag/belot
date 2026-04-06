import type { Player, Team } from "@belot/types";
import { describe, expect, it } from "vitest";

import { getPlayersCount, getPlayersNames, getTeamsNames } from "./playerNamesHelpers";

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
});
