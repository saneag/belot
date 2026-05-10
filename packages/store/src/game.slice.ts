import { GameMode, type GameSlice } from "@belot/types";

import type { StateCreator } from "zustand";

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  mode: GameMode.classic,
  gameId: null,

  setGameId: (gameId) => set(() => ({ gameId })),
});
