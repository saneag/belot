import { POINTS_TYPE } from "@belot/constants";
import { GameMode, type GameSlice } from "@belot/types";

import type { StateCreator } from "zustand";

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  mode: GameMode.classic,
  gameId: null,
  pointsType: POINTS_TYPE[0].id,

  setGameId: (gameId) => set(() => ({ gameId })),
  setPointsType: (pointsType) => set(() => ({ pointsType })),
});
