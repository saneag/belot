import { StateCreator } from 'zustand';
import { GameMode } from '../types/game';

export interface GameSlice {
  mode: GameMode;
  hasPreviousGame: boolean;

  setHasPreviousGame: (hasPreviousGame: boolean) => void;
}

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  mode: GameMode.classic,
  hasPreviousGame: false,

  setHasPreviousGame: (hasPreviousGame) => set(() => ({ hasPreviousGame })),
});
