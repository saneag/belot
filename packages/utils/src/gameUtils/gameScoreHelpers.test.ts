import { DEFAULT_ROUND_POINTS } from "@belot/constants";
import { GameMode, PlayersSlice, RoundScore, RoundSlice } from "@belot/types";

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
  });

  describe("setPreviousDealer", () => {
    it("should return the previous dealer", () => {});
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

  describe("getOpponentPlayersScore", () => {
    it("should return the opponent players score", () => {});

    const result = getOpponentPlayersScore(mockPlayers[0], mockPlayersScores);

    expect(result).toEqual(mockPlayersScores.slice(1));
  });

  describe("getOpponentTeamScore", () => {
    it("should return the opponent team score", () => {});

    const result = getOpponentTeamScore(mockPlayers[0], mockTeamsScores);

    expect(result).toEqual(mockTeamsScores.slice(1));
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
  });
});
