import { DEFAULT_ROUND_POINTS } from "@belot/constants";
import { GameMode, PlayerScore, RoundScore, TeamScore } from "@belot/types";

import { describe, expect, it } from "vitest";

import {
  basePlayerScore,
  baseRoundScore,
  baseTeamScore,
  mockPlayers,
  mockPlayersScores,
  mockRoundSlice,
  mockTeams,
  mockTeamsScores,
} from "../../__mocks__/gameScoreHelpers";
import {
  prepareEmptyRoundScoreRow,
  preparePreviousRoundScoreRow,
  prepareRoundScoresBasedOnGameMode,
  prepareTeams,
} from "./prepareStates";

describe("prepareStates", () => {
  describe("prepareEmptyRoundScoreRow", () => {
    it("uses id 0 and zeroed player rows when there is no previous round (classic)", () => {
      const state = {
        ...mockRoundSlice,
        mode: GameMode.classic,
        players: mockPlayers,
        roundsScores: [] as RoundScore[],
      };

      const row = prepareEmptyRoundScoreRow(state);

      expect(row).toEqual({
        id: 0,
        playersScores: mockPlayers.map((player, index) => ({
          id: index,
          playerId: player.id,
          score: 0,
          boltCount: 0,
          totalScore: 0,
        })),
        teamsScores: [],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: null,
      });
    });

    it("increments id from the last round and copies player bolt/total from the last round (classic)", () => {
      const lastPlayers: PlayerScore[] = [
        basePlayerScore({ id: 0, playerId: 1, boltCount: 2, totalScore: 50, score: 10 }),
        basePlayerScore({ id: 1, playerId: 2, boltCount: 0, totalScore: 30, score: 5 }),
      ];

      const state = {
        ...mockRoundSlice,
        mode: GameMode.classic,
        players: mockPlayers,
        roundsScores: [
          baseRoundScore({
            id: 0,
            playersScores: lastPlayers,
            teamsScores: mockTeamsScores,
            totalRoundScore: DEFAULT_ROUND_POINTS,
          }),
        ],
      };

      const row = prepareEmptyRoundScoreRow(state);

      expect(row.id).toBe(1);
      expect(row.playersScores).toEqual([
        {
          id: 0,
          playerId: 1,
          score: 0,
          boltCount: 2,
          totalScore: 50,
        },
        {
          id: 1,
          playerId: 2,
          score: 0,
          boltCount: 0,
          totalScore: 30,
        },
      ]);
      expect(row.teamsScores).toEqual([]);
    });

    it("returns empty player scores in teams mode", () => {
      const state = {
        ...mockRoundSlice,
        mode: GameMode.teams,
        teams: mockTeams,
        roundsScores: [] as RoundScore[],
      };

      const row = prepareEmptyRoundScoreRow(state);

      expect(row.playersScores).toEqual([]);
    });

    it("uses id 0 and zeroed team rows when there is no previous round (teams)", () => {
      const state = {
        ...mockRoundSlice,
        mode: GameMode.teams,
        teams: mockTeams,
        roundsScores: [] as RoundScore[],
      };

      const row = prepareEmptyRoundScoreRow(state);

      expect(row.id).toBe(0);
      expect(row.teamsScores).toEqual([
        { id: 0, teamId: 1, score: 0, boltCount: 0, totalScore: 0 },
        { id: 1, teamId: 2, score: 0, boltCount: 0, totalScore: 0 },
      ]);
    });

    it("copies team bolt/total from the last round (teams)", () => {
      const lastTeams: TeamScore[] = [
        baseTeamScore({ id: 0, teamId: 1, boltCount: 1, totalScore: 80, score: 20 }),
        baseTeamScore({ id: 1, teamId: 2, boltCount: 0, totalScore: 40, score: 10 }),
      ];

      const state = {
        ...mockRoundSlice,
        mode: GameMode.teams,
        teams: mockTeams,
        roundsScores: [
          baseRoundScore({
            id: 4,
            playersScores: mockPlayersScores,
            teamsScores: lastTeams,
            totalRoundScore: DEFAULT_ROUND_POINTS,
          }),
        ],
      };

      const row = prepareEmptyRoundScoreRow(state);

      expect(row.id).toBe(5);
      expect(row.teamsScores).toEqual([
        { id: 0, teamId: 1, score: 0, boltCount: 1, totalScore: 80 },
        { id: 1, teamId: 2, score: 0, boltCount: 0, totalScore: 40 },
      ]);
    });

    it("returns empty player scores when players are missing (classic)", () => {
      const state = {
        ...mockRoundSlice,
        mode: GameMode.classic,
        roundsScores: [] as RoundScore[],
      };

      expect(prepareEmptyRoundScoreRow(state).playersScores).toEqual([]);
    });

    it("returns empty team scores when teams are missing (teams mode)", () => {
      const state = {
        ...mockRoundSlice,
        mode: GameMode.teams,
        roundsScores: [] as RoundScore[],
      };

      expect(prepareEmptyRoundScoreRow(state).teamsScores).toEqual([]);
    });
  });

  describe("preparePreviousRoundScoreRow", () => {
    it("restores undone id, clears round scores, and resets totalRoundScore", () => {
      const previous: RoundScore = baseRoundScore({
        id: 1,
        playersScores: [
          basePlayerScore({ id: 0, playerId: 1, score: 12, boltCount: 1, totalScore: 100 }),
        ],
        teamsScores: [
          baseTeamScore({ id: 0, teamId: 1, score: 24, boltCount: 0, totalScore: 200 }),
        ],
        totalRoundScore: 99,
        roundPlayer: mockPlayers[0],
      });

      const undone: RoundScore = baseRoundScore({
        id: 7,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: DEFAULT_ROUND_POINTS,
      });

      const row = preparePreviousRoundScoreRow(previous, undone);

      expect(row).toEqual({
        id: 7,
        playersScores: [
          { id: 0, playerId: 1, score: 0, boltCount: 1, totalScore: 100 },
        ],
        teamsScores: [{ id: 0, teamId: 1, score: 0, boltCount: 0, totalScore: 200 }],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: null,
      });
    });
  });

  describe("prepareTeams", () => {
    it("returns no teams in classic mode", () => {
      expect(prepareTeams(mockPlayers, GameMode.classic)).toEqual([]);
    });

    it("pairs players 0+2 and 1+3 with fixed ids and names in teams mode", () => {
      expect(prepareTeams(mockPlayers, GameMode.teams)).toEqual([
        { id: 0, playersIds: [1, 3], name: "N" },
        { id: 1, playersIds: [2, 4], name: "V" },
      ]);
    });
  });

  describe("prepareRoundScoresBasedOnGameMode", () => {
    const roundScore: RoundScore = baseRoundScore({
      id: 0,
      playersScores: mockPlayersScores,
      teamsScores: mockTeamsScores,
      totalRoundScore: DEFAULT_ROUND_POINTS,
    });

    it("selects the player score row in classic mode", () => {
      const opponent: PlayerScore = basePlayerScore({ id: 2, playerId: 2 });
      const result = prepareRoundScoresBasedOnGameMode(GameMode.classic, roundScore, opponent);
      expect(result).toEqual(mockPlayersScores.find((p) => p.id === 2));
    });

    it("selects the team score row in teams mode", () => {
      const opponent: TeamScore = baseTeamScore({ id: 1, teamId: 1 });
      const result = prepareRoundScoresBasedOnGameMode(GameMode.teams, roundScore, opponent);
      expect(result).toEqual(mockTeamsScores.find((t) => t.id === 1));
    });

    it("returns undefined when no matching opponent id exists", () => {
      const ghostPlayer = basePlayerScore({ id: 99, playerId: 99 });
      expect(
        prepareRoundScoresBasedOnGameMode(GameMode.classic, roundScore, ghostPlayer),
      ).toBeUndefined();

      const ghostTeam = baseTeamScore({ id: 99, teamId: 99 });
      expect(
        prepareRoundScoresBasedOnGameMode(GameMode.teams, roundScore, ghostTeam),
      ).toBeUndefined();
    });
  });
});
