import { DEFAULT_ROUND_POINTS } from "@belot/constants";
import { GameMode, type Player, type PlayerScore, type RoundScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createGameStore, useGameStore } from "./index";

const baseRoundScore = (partial: Partial<RoundScore> & Pick<RoundScore, "id">): RoundScore => ({
  playersScores: [],
  teamsScores: [],
  totalRoundScore: 0,
  roundPlayer: null,
  ...partial,
});

const basePlayerScore = (partial: Partial<PlayerScore> & Pick<PlayerScore, "id" | "playerId">) => ({
  score: 0,
  boltCount: 0,
  totalScore: 0,
  ...partial,
});

describe("gameStore", () => {
  describe("createGameStore", () => {
    let store: ReturnType<typeof createGameStore>;

    beforeEach(() => {
      store = createGameStore();
    });

    describe("game slice", () => {
      it("setHasPreviousGame updates the flag", () => {
        store.getState().setHasPreviousGame(true);
        expect(store.getState().hasPreviousGame).toBe(true);
        store.getState().setHasPreviousGame(false);
        expect(store.getState().hasPreviousGame).toBe(false);
      });

      it("setGameId updates the id", () => {
        store.getState().setGameId("game-1");
        expect(store.getState().gameId).toBe("game-1");
        store.getState().setGameId(null);
        expect(store.getState().gameId).toBeNull();
      });
    });

    describe("players slice", () => {
      it("setPlayers switches to teams mode with four players and builds teams", () => {
        const players: Player[] = [
          { id: 0, name: "A", teamId: 0 },
          { id: 1, name: "B", teamId: 1 },
          { id: 2, name: "C", teamId: 0 },
          { id: 3, name: "D", teamId: 1 },
        ];
        store.getState().setPlayers(players);
        expect(store.getState().mode).toBe(GameMode.teams);
        expect(store.getState().players).toEqual(players);
        expect(store.getState().teams).toHaveLength(2);
      });

      it("setPlayers uses classic mode when fewer than four players", () => {
        const players: Player[] = [
          { id: 0, name: "A" },
          { id: 1, name: "B" },
          { id: 2, name: "C" },
        ];
        store.getState().setPlayers(players);
        expect(store.getState().mode).toBe(GameMode.classic);
        expect(store.getState().teams).toEqual([]);
      });

      it("setEmptyPlayersNames uses teams layout for four slots", () => {
        store.getState().setEmptyPlayersNames(4);
        expect(store.getState().mode).toBe(GameMode.teams);
        expect(store.getState().players).toHaveLength(4);
        expect(store.getState().players.map((p) => p.teamId)).toEqual([0, 1, 0, 1]);
        expect(store.getState().teams).toHaveLength(2);
      });

      it("setEmptyPlayersNames uses classic layout for non-team counts", () => {
        store.getState().setEmptyPlayersNames(3);
        expect(store.getState().mode).toBe(GameMode.classic);
        expect(store.getState().players.every((p) => p.teamId === undefined)).toBe(true);
      });

      it("updatePlayer merges fields for a single player", () => {
        store.getState().setEmptyPlayersNames(2);
        store.getState().updatePlayer(0, { name: "X" });
        expect(store.getState().players[0].name).toBe("X");
        expect(store.getState().players[1].name).toBe("");
      });

      it("shufflePlayers leaves order deterministic when Math.random is fixed", () => {
        store.getState().setPlayers([
          { id: 0, name: "a" },
          { id: 1, name: "b" },
          { id: 2, name: "c" },
        ]);
        const spy = vi.spyOn(Math, "random").mockReturnValue(0);
        store.getState().shufflePlayers();
        spy.mockRestore();
        expect(store.getState().players.map((p) => p.name)).toEqual(["b", "c", "a"]);
      });

      it("shufflePlayers does nothing harmful with zero or one player", () => {
        store.getState().setEmptyPlayersNames(1);
        store.getState().shufflePlayers();
        expect(store.getState().players).toHaveLength(1);
      });
    });

    describe("rounds slice", () => {
      it("setDealer stores the dealer", () => {
        const dealer: Player = { id: 0, name: "D" };
        store.getState().setDealer(dealer);
        expect(store.getState().dealer).toEqual(dealer);
        store.getState().setDealer(null);
        expect(store.getState().dealer).toBeNull();
      });

      it("setEmptyRoundScore appends a row, clears undone stack, and advances dealer on a later round", () => {
        store.getState().setEmptyPlayersNames(3);
        store.getState().setDealer(store.getState().players[0]);
        store.getState().setEmptyRoundScore();
        expect(store.getState().roundsScores).toHaveLength(1);
        expect(store.getState().roundsScores[0].id).toBe(0);
        expect(store.getState().roundsScores[0].totalRoundScore).toBe(DEFAULT_ROUND_POINTS);
        expect(store.getState().undoneRoundsScores).toEqual([]);
        // setNextDealer reads pre-update roundsScores; first append still sees [] so dealer unchanged.
        expect(store.getState().dealer?.id).toBe(0);
        store.getState().setEmptyRoundScore();
        expect(store.getState().roundsScores).toHaveLength(2);
        expect(store.getState().dealer?.id).toBe(store.getState().players[1].id);
      });

      it("setRoundsScores replaces rounds; dealer rotates when prior roundsScores was non-empty", () => {
        store.getState().setEmptyPlayersNames(3);
        store.getState().setDealer(store.getState().players[0]);
        const row0 = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 1 }),
            basePlayerScore({ id: 1, playerId: 1, score: 2 }),
            basePlayerScore({ id: 2, playerId: 2, score: 3 }),
          ],
          totalRoundScore: 100,
        });
        store.getState().setRoundsScores([row0]);
        expect(store.getState().dealer?.id).toBe(0);
        const row1 = baseRoundScore({
          id: 1,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 0 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0 }),
          ],
          totalRoundScore: 120,
        });
        store.getState().setRoundsScores([row0, row1]);
        expect(store.getState().roundsScores).toEqual([row0, row1]);
        expect(store.getState().dealer?.id).toBe(store.getState().players[1].id);
      });

      it("updateRoundScore merges an existing row and appends a fresh empty row", () => {
        store.getState().setEmptyPlayersNames(3);
        const row0 = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 5, totalScore: 5 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0, totalScore: 0 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0, totalScore: 0 }),
          ],
          totalRoundScore: 120,
        });
        store.getState().setRoundsScores([row0]);
        store.getState().updateRoundScore({ id: 0, totalRoundScore: 99 });
        expect(store.getState().roundsScores).toHaveLength(2);
        expect(store.getState().roundsScores[0].totalRoundScore).toBe(99);
        expect(store.getState().roundsScores[1].id).toBe(1);
        expect(store.getState().undoneRoundsScores).toEqual([]);
      });

      it("updateRoundScore is a no-op when the id is missing", () => {
        store.getState().setEmptyPlayersNames(3);
        const row0 = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0 }),
            basePlayerScore({ id: 1, playerId: 1 }),
            basePlayerScore({ id: 2, playerId: 2 }),
          ],
          totalRoundScore: 100,
        });
        store.getState().setRoundsScores([row0]);
        const before = store.getState().roundsScores;
        store.getState().updateRoundScore({ id: 99, totalRoundScore: 1 });
        expect(store.getState().roundsScores).toBe(before);
        expect(store.getState().roundsScores).toEqual([row0]);
      });

      it("skipRound is a no-op without rounds", () => {
        store.getState().setEmptyPlayersNames(2);
        store.getState().skipRound();
        expect(store.getState().roundsScores).toEqual([]);
      });

      it("skipRound rounds the last total and appends a new empty row", () => {
        store.getState().setEmptyPlayersNames(3);
        const row0 = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0 }),
            basePlayerScore({ id: 1, playerId: 1 }),
            basePlayerScore({ id: 2, playerId: 2 }),
          ],
          totalRoundScore: 46,
        });
        store.getState().setRoundsScores([row0]);
        store.getState().skipRound();
        expect(store.getState().roundsScores).toHaveLength(2);
        expect(store.getState().roundsScores[0].totalRoundScore).toBe(5);
        expect(store.getState().roundsScores[1].totalRoundScore).toBe(DEFAULT_ROUND_POINTS);
      });

      it("undoRoundScore delegates to recalculateScoreOnUndo", () => {
        store.getState().setEmptyPlayersNames(3);
        const r0 = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 10, totalScore: 50 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0, totalScore: 40 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0, totalScore: 30 }),
          ],
          totalRoundScore: 162,
        });
        const r1 = baseRoundScore({
          id: 1,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 1, totalScore: 51 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0, totalScore: 40 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0, totalScore: 30 }),
          ],
          totalRoundScore: 200,
        });
        const r2 = baseRoundScore({
          id: 2,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 99, totalScore: 150 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0, totalScore: 40 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0, totalScore: 30 }),
          ],
          totalRoundScore: 180,
        });
        store.getState().setRoundsScores([r0, r1, r2]);
        store.getState().setDealer(store.getState().players[2]);
        store.getState().undoRoundScore();
        expect(store.getState().undoneRoundsScores).toHaveLength(1);
        expect(store.getState().undoneRoundsScores[0]).toEqual(r1);
        expect(store.getState().roundsScores).toHaveLength(2);
      });

      it("redoRoundScore delegates to recalculateScoreOnRedo", () => {
        store.getState().setEmptyPlayersNames(3);
        const restored = baseRoundScore({
          id: 3,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 7, totalScore: 60 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0, totalScore: 40 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0, totalScore: 30 }),
          ],
          totalRoundScore: 170,
        });
        const currentLast = baseRoundScore({
          id: 4,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, score: 7, totalScore: 67 }),
            basePlayerScore({ id: 1, playerId: 1, score: 0, totalScore: 40 }),
            basePlayerScore({ id: 2, playerId: 2, score: 0, totalScore: 30 }),
          ],
          totalRoundScore: 165,
        });
        store.getState().setRoundsScores([
          baseRoundScore({
            id: 1,
            playersScores: [
              basePlayerScore({ id: 0, playerId: 0 }),
              basePlayerScore({ id: 1, playerId: 1 }),
              basePlayerScore({ id: 2, playerId: 2 }),
            ],
            totalRoundScore: 100,
          }),
          baseRoundScore({
            id: 2,
            playersScores: [
              basePlayerScore({ id: 0, playerId: 0 }),
              basePlayerScore({ id: 1, playerId: 1 }),
              basePlayerScore({ id: 2, playerId: 2 }),
            ],
            totalRoundScore: 120,
          }),
          currentLast,
        ]);
        store.setState({ undoneRoundsScores: [restored] });
        store.getState().setDealer(store.getState().players[1]);
        store.getState().redoRoundScore();
        expect(store.getState().undoneRoundsScores).toEqual([]);
        expect(store.getState().roundsScores[2]).toEqual(restored);
        expect(store.getState().roundsScores).toHaveLength(4);
        expect(store.getState().dealer?.id).toBe(store.getState().players[2].id);
      });
    });

    describe("reset", () => {
      it("clears players, rounds, dealer, and teams but keeps game slice fields", () => {
        store.getState().setGameId("keep-me");
        store.getState().setHasPreviousGame(true);
        store.getState().setEmptyPlayersNames(3);
        store.getState().setDealer(store.getState().players[0]);
        store.getState().setEmptyRoundScore();
        store.getState().reset();
        expect(store.getState().players).toEqual([]);
        expect(store.getState().teams).toEqual([]);
        expect(store.getState().mode).toBe(GameMode.classic);
        expect(store.getState().dealer).toBeNull();
        expect(store.getState().roundsScores).toEqual([]);
        expect(store.getState().undoneRoundsScores).toEqual([]);
        expect(store.getState().gameId).toBe("keep-me");
        expect(store.getState().hasPreviousGame).toBe(true);
      });
    });
  });

  describe("useGameStore singleton", () => {
    it("exposes a working store", () => {
      expect(useGameStore.getState().mode).toBe(GameMode.classic);
      useGameStore.getState().setHasPreviousGame(true);
      expect(useGameStore.getState().hasPreviousGame).toBe(true);
      useGameStore.getState().setHasPreviousGame(false);
    });
  });
});
