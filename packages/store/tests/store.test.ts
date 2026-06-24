import { DEFAULT_ROUND_POINTS, POINTS_TYPE } from "@belot/constants";
import { GameMode, type Player, type PlayerScore, type RoundScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createGameStore, useGameStore } from "../src/index";

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
      it("setGameId updates the id", () => {
        store.getState().setGameId("game-1");
        expect(store.getState().gameId).toBe("game-1");
        store.getState().setGameId(null);
        expect(store.getState().gameId).toBeNull();
      });

      it("updates points type and max score", () => {
        store.getState().setPointsType(POINTS_TYPE[1].id);
        store.getState().setMaxScore(151);

        expect(store.getState().pointsType).toBe(POINTS_TYPE[1].id);
        expect(store.getState().maxScore).toBe(151);
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

      it("setRoundsScores normalizes non-array input to an empty list", () => {
        store.getState().setEmptyPlayersNames(3);
        store.getState().setRoundsScores(null as unknown as RoundScore[]);
        expect(store.getState().roundsScores).toEqual([]);
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

      it("skipRound normalizes the pending row when there is no previous completed round", () => {
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
        expect(store.getState().roundsScores[1].totalRoundScore).toBe(5);
      });

      it("skipRound falls back to micropoints when pointsType is missing", () => {
        store.getState().setEmptyPlayersNames(3);
        const row0 = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0 }),
            basePlayerScore({ id: 1, playerId: 1 }),
            basePlayerScore({ id: 2, playerId: 2 }),
          ],
          totalRoundScore: 44,
        });
        store.setState({ roundsScores: [row0], pointsType: undefined });

        store.getState().skipRound();

        expect(store.getState().roundsScores[0].totalRoundScore).toBe(4);
      });

      it("skipRound copies totalRoundScore from the previous completed round", () => {
        store.getState().setEmptyPlayersNames(3);
        const completedRound = baseRoundScore({
          id: 0,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, totalScore: 36 }),
            basePlayerScore({ id: 1, playerId: 1, totalScore: 10 }),
            basePlayerScore({ id: 2, playerId: 2, totalScore: 10 }),
          ],
          totalRoundScore: 36,
        });
        const pendingRound = baseRoundScore({
          id: 1,
          playersScores: [
            basePlayerScore({ id: 0, playerId: 0, totalScore: 36 }),
            basePlayerScore({ id: 1, playerId: 1, totalScore: 10 }),
            basePlayerScore({ id: 2, playerId: 2, totalScore: 10 }),
          ],
          totalRoundScore: DEFAULT_ROUND_POINTS,
        });
        store.getState().setRoundsScores([completedRound, pendingRound]);
        store.getState().skipRound();
        expect(store.getState().roundsScores).toHaveLength(3);
        expect(store.getState().roundsScores[1].totalRoundScore).toBe(36);
        expect(store.getState().roundsScores[2].totalRoundScore).toBe(36);
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
      it("marks the store for reset", () => {
        store.getState().markForReset();
        expect(store.getState().pendingReset).toBe(true);
      });

      it("clears players, rounds, dealer, and teams but keeps game slice fields", () => {
        store.getState().setGameId("keep-me");
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
      });
    });
  });

  describe("useGameStore singleton", () => {
    it("exposes a working store", () => {
      expect(useGameStore.getState().mode).toBe(GameMode.classic);
    });
  });
});
