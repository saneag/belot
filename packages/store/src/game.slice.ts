import { GameMode, type GameSlice } from "@belot/types";

import type { StateCreator } from "zustand";

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  mode: GameMode.classic,
  hasPreviousGame: false,
  gameId: null,

  setHasPreviousGame: (hasPreviousGame) => set(() => ({ hasPreviousGame })),
  setGameId: (gameId) => set(() => ({ gameId })),
});
