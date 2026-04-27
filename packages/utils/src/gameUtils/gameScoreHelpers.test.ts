import { DEFAULT_ROUND_POINTS, NEXT_WINNING_STEP, WIN_POINTS } from "@belot/constants";
import {
  GameMode,
  type Player,
  type PlayersSlice,
  type RoundScore,
  type RoundSlice,
} from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockDealer,
  mockPlayers,
  mockPlayersScores,
  mockRoundScores,
  mockRoundSlice,
  mockTeams,
  mockTeamsScores,
} from "./../../__mocks__/gameScoreHelpers";
import {
  checkForGameWinner,
  getOpponentPlayersScore,
  getOpponentTeamScore,
  setNextDealer,
  setPreviousDealer,
} from "./gameScoreHelpers";

describe("gameScoreHelpers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("setNextDealer", () => {
    it("should return the next dealer", () => {
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: mockDealer,
        players: mockPlayers,
      };

      const result = setNextDealer(mockState);

      expect(result).toEqual({
        dealer: mockPlayers[1],
      });
    });

    it("should return empty object when there are no round scores", () => {
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: [],
        dealer: mockDealer,
        players: mockPlayers,
      };

      expect(setNextDealer(mockState)).toEqual({});
    });

    it("should return empty object when players are missing or empty", () => {
      const base: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: mockDealer,
      };

      expect(setNextDealer({ ...base, players: undefined })).toEqual({});
      expect(setNextDealer({ ...base, players: [] })).toEqual({});
    });

    it("should use first player as next dealer when current dealer is not in the list", () => {
      const unknownDealer: Player = { id: 99, name: "Ghost", teamId: 1 };
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: unknownDealer,
        players: mockPlayers,
      };

      expect(setNextDealer(mockState)).toEqual({ dealer: mockPlayers[0] });
    });
  });

  describe("setPreviousDealer", () => {
    it("should return the previous dealer", () => {
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: mockDealer,
        players: mockPlayers,
      };

      setNextDealer(mockState);
      const result = setPreviousDealer(mockState);

      expect(result).toEqual({
        dealer: mockPlayers[0],
      });
    });

    it("should return empty object when there are no round scores", () => {
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: [],
        dealer: mockPlayers[1],
        players: mockPlayers,
      };

      expect(setPreviousDealer(mockState)).toEqual({});
    });

    it("should return empty object when players are missing or empty", () => {
      const base: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: mockDealer,
      };

      expect(setPreviousDealer({ ...base, players: undefined })).toEqual({});
      expect(setPreviousDealer({ ...base, players: [] })).toEqual({});
    });

    it("should use first player when current dealer is not in the list", () => {
      const unknownDealer: Player = { id: 99, name: "Ghost", teamId: 1 };
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: unknownDealer,
        players: mockPlayers,
      };

      expect(setPreviousDealer(mockState)).toEqual({ dealer: mockPlayers[0] });
    });

    it("should clamp previous index when current dealer is first in list", () => {
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: mockPlayers[0],
        players: mockPlayers,
      };

      expect(setPreviousDealer(mockState)).toEqual({ dealer: mockPlayers[0] });
    });

    it("should return the preceding player when dealer is not at index zero", () => {
      const mockState: RoundSlice & Partial<PlayersSlice> = {
        ...mockRoundSlice,
        roundsScores: mockRoundScores,
        dealer: mockPlayers[2],
        players: mockPlayers,
      };

      expect(setPreviousDealer(mockState)).toEqual({ dealer: mockPlayers[1] });
    });
  });

  describe("getOpponentPlayersScore", () => {
    it("should return the opponent players score", () => {
      const result = getOpponentPlayersScore(mockPlayers[0], mockPlayersScores);

      expect(result).toEqual(mockPlayersScores.slice(1));
    });

    it("should return undefined when scores are omitted", () => {
      expect(getOpponentPlayersScore(mockPlayers[0], undefined)).toBeUndefined();
    });

    it("should keep all scores when round player is null", () => {
      expect(getOpponentPlayersScore(null, mockPlayersScores)).toEqual(mockPlayersScores);
    });
  });

  describe("getOpponentTeamScore", () => {
    it("should return the opponent team score", () => {
      const result = getOpponentTeamScore(mockPlayers[0], mockTeamsScores);

      expect(result).toEqual(mockTeamsScores.slice(1));
    });

    it("should return undefined when scores are omitted", () => {
      expect(getOpponentTeamScore(mockPlayers[0], undefined)).toBeUndefined();
    });

    it("should keep all scores when round player is null", () => {
      expect(getOpponentTeamScore(null, mockTeamsScores)).toEqual(mockTeamsScores);
    });
  });

  describe("checkForGameWinner", () => {
    const mockSetGameOverflowCount = vi.fn((value: number | ((prev: number) => number)) => value);

    // players classic
    it("should return the game winner if game mode is classic and there is only one winner", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: [
          {
            ...mockPlayersScores[0],
            totalScore: 101,
          },
          ...mockPlayersScores.slice(1),
        ],
        teamsScores: mockTeamsScores,
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      const result = checkForGameWinner(
        GameMode.classic,
        mockPlayers,
        mockTeams,
        mockCalculatedRoundScore,
        0,
        mockSetGameOverflowCount,
      );

      expect(result).toEqual(mockPlayers[0]);
      expect(mockSetGameOverflowCount).not.toHaveBeenCalled();
    });

    it("should return null if game mode is classic and there is no winner", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: [
          {
            ...mockPlayersScores[0],
            totalScore: 99,
          },
          ...mockPlayersScores.slice(1),
        ],
        teamsScores: mockTeamsScores,
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      const result = checkForGameWinner(
        GameMode.classic,
        mockPlayers,
        mockTeams,
        mockCalculatedRoundScore,
        0,
        mockSetGameOverflowCount,
      );

      expect(result).toEqual(null);
      expect(mockSetGameOverflowCount).not.toHaveBeenCalled();
    });

    it("should return null if game mode is classic and there is only more than one winner and should call setGameOverflowCount", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: [
          {
            ...mockPlayersScores[0],
            totalScore: 101,
          },
          {
            ...mockPlayersScores[1],
            totalScore: 101,
          },
          ...mockPlayersScores.slice(2),
        ],
        teamsScores: mockTeamsScores,
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      const result = checkForGameWinner(
        GameMode.classic,
        mockPlayers,
        mockTeams,
        mockCalculatedRoundScore,
        0,
        mockSetGameOverflowCount,
      );

      expect(result).toEqual(null);
      // it call a set state function with a callback inside
      expect(mockSetGameOverflowCount).toHaveBeenCalledWith(expect.any(Function));
    });

    // teams
    it("should return the game winner if game mode is teams and there is only one winner", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: mockPlayersScores,
        teamsScores: [
          {
            ...mockTeamsScores[0],
            totalScore: 101,
          },
          ...mockTeamsScores.slice(1),
        ],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      const result = checkForGameWinner(
        GameMode.teams,
        mockPlayers,
        mockTeams,
        mockCalculatedRoundScore,
        0,
        mockSetGameOverflowCount,
      );

      expect(result).toEqual(mockTeams[0]);
      expect(mockSetGameOverflowCount).not.toHaveBeenCalled();
    });

    it("should return null if game mode is teams and there is no winner", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: mockPlayersScores,
        teamsScores: [
          {
            ...mockTeamsScores[0],
            totalScore: 99,
          },
          ...mockTeamsScores.slice(1),
        ],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      const result = checkForGameWinner(
        GameMode.teams,
        mockPlayers,
        mockTeams,
        mockCalculatedRoundScore,
        0,
        mockSetGameOverflowCount,
      );

      expect(result).toEqual(null);
      expect(mockSetGameOverflowCount).not.toHaveBeenCalled();
    });

    it("should return null if game mode is teams and there is only more than one winner and should call setGameOverflowCount", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: mockPlayersScores,
        teamsScores: [
          {
            ...mockTeamsScores[0],
            totalScore: 101,
          },
          {
            ...mockTeamsScores[1],
            totalScore: 101,
          },
          ...mockTeamsScores.slice(2),
        ],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      const result = checkForGameWinner(
        GameMode.teams,
        mockPlayers,
        mockTeams,
        mockCalculatedRoundScore,
        0,
        mockSetGameOverflowCount,
      );

      expect(result).toEqual(null);
      // it call a set state function with a callback inside
      expect(mockSetGameOverflowCount).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should return null in classic mode when winning score references an unknown player", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: [
          {
            ...mockPlayersScores[0],
            playerId: 999,
            totalScore: WIN_POINTS,
          },
          ...mockPlayersScores.slice(1),
        ],
        teamsScores: mockTeamsScores,
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      expect(
        checkForGameWinner(
          GameMode.classic,
          mockPlayers,
          mockTeams,
          mockCalculatedRoundScore,
          0,
          mockSetGameOverflowCount,
        ),
      ).toBeNull();
    });

    it("should return null in teams mode when winning score references an unknown team", () => {
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: mockPlayersScores,
        teamsScores: [
          {
            ...mockTeamsScores[0],
            teamId: 999,
            totalScore: WIN_POINTS,
          },
          ...mockTeamsScores.slice(1),
        ],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      expect(
        checkForGameWinner(
          GameMode.teams,
          mockPlayers,
          mockTeams,
          mockCalculatedRoundScore,
          0,
          mockSetGameOverflowCount,
        ),
      ).toBeNull();
    });

    it("should use raised win threshold when gameOverflowCount is greater than zero", () => {
      const threshold = WIN_POINTS + NEXT_WINNING_STEP;
      const mockCalculatedRoundScore: RoundScore = {
        id: 1,
        playersScores: [
          {
            ...mockPlayersScores[0],
            totalScore: threshold,
          },
          ...mockPlayersScores.slice(1).map((ps) => ({ ...ps, totalScore: WIN_POINTS })),
        ],
        teamsScores: mockTeamsScores,
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      expect(
        checkForGameWinner(
          GameMode.classic,
          mockPlayers,
          mockTeams,
          mockCalculatedRoundScore,
          1,
          mockSetGameOverflowCount,
        ),
      ).toEqual(mockPlayers[0]);

      const teamsRoundScore: RoundScore = {
        ...mockCalculatedRoundScore,
        playersScores: mockPlayersScores,
        teamsScores: [
          { ...mockTeamsScores[0], totalScore: threshold },
          { ...mockTeamsScores[1], totalScore: WIN_POINTS },
        ],
      };

      expect(
        checkForGameWinner(
          GameMode.teams,
          mockPlayers,
          mockTeams,
          teamsRoundScore,
          1,
          mockSetGameOverflowCount,
        ),
      ).toEqual(mockTeams[0]);
    });

    it("should invoke overflow callback with an incrementing updater", () => {
      mockSetGameOverflowCount.mockClear();

      const classicTieRound: RoundScore = {
        id: 1,
        playersScores: [
          { ...mockPlayersScores[0], totalScore: 101 },
          { ...mockPlayersScores[1], totalScore: 101 },
          ...mockPlayersScores.slice(2),
        ],
        teamsScores: mockTeamsScores,
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      checkForGameWinner(
        GameMode.classic,
        mockPlayers,
        mockTeams,
        classicTieRound,
        0,
        mockSetGameOverflowCount,
      );

      const classicUpdater = mockSetGameOverflowCount.mock.calls[0][0] as (prev: number) => number;
      expect(classicUpdater(3)).toBe(4);

      mockSetGameOverflowCount.mockClear();

      const teamsTieRound: RoundScore = {
        id: 1,
        playersScores: mockPlayersScores,
        teamsScores: [
          { ...mockTeamsScores[0], totalScore: 101 },
          { ...mockTeamsScores[1], totalScore: 101 },
        ],
        totalRoundScore: DEFAULT_ROUND_POINTS,
        roundPlayer: mockPlayers[0],
      };

      checkForGameWinner(
        GameMode.teams,
        mockPlayers,
        mockTeams,
        teamsTieRound,
        0,
        mockSetGameOverflowCount,
      );

      const teamsUpdater = mockSetGameOverflowCount.mock.calls[0][0] as (prev: number) => number;
      expect(teamsUpdater(5)).toBe(6);
    });
  });
});
