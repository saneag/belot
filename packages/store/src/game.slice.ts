import { GameMode, GameSlice } from "@belot/types";

import { StateCreator } from "zustand";

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  mode: GameMode.classic,
  hasPreviousGame: false,

  setHasPreviousGame: (hasPreviousGame) => set(() => ({ hasPreviousGame })),
});
