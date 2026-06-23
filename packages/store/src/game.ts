import { POINTS_TYPE, WIN_POINTS } from "@belot/constants";
import { GameMode, type GameSlice, type PlayersSlice, type RoundSlice } from "@belot/types";

import { create } from "zustand";

import { createGameSlice } from "./game.slice";
import { createPlayersSlice } from "./players.slice";
import { createRoundSlice } from "./rounds.slice";

export interface GameStore extends GameSlice, PlayersSlice, RoundSlice {
  pendingReset: boolean;
  markForReset: () => void;
  reset: () => void;
}

export const createGameStore = () =>
  create<GameStore>((set, ...rest) => ({
    ...createPlayersSlice(set, ...rest),
    ...createRoundSlice(set, ...rest),
    ...createGameSlice(set, ...rest),

    pendingReset: false,

    markForReset: () => set(() => ({ pendingReset: true })),

    reset: () =>
      set(() => ({
        players: [],
        mode: GameMode.classic,
        pointsType: POINTS_TYPE[0].id,
        maxScore: WIN_POINTS,
        dealer: null,
        roundsScores: [],
        teams: [],
        undoneRoundsScores: [],
        pendingReset: false,
      })),
  }));

export const useGameStore = createGameStore();
