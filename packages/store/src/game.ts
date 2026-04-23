import { GameMode, type GameSlice, type PlayersSlice, type RoundSlice } from "@belot/types";

import { create } from "zustand";

import { createGameSlice } from "./game.slice";
import { createPlayersSlice } from "./players.slice";
import { createRoundSlice } from "./rounds.slice";

export interface GameStore extends GameSlice, PlayersSlice, RoundSlice {
  reset: () => void;
}

export const createGameStore = () =>
  create<GameStore>((set, ...rest) => ({
    ...createPlayersSlice(set, ...rest),
    ...createRoundSlice(set, ...rest),
    ...createGameSlice(set, ...rest),

    reset: () =>
      set(() => ({
        players: [],
        mode: GameMode.classic,
        dealer: null,
        roundsScores: [],
        teams: [],
        undoneRoundsScores: [],
      })),
  }));

export const useGameStore = createGameStore();
