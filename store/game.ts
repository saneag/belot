import { create } from 'zustand';
import {
  prepareEmptyScoreRow,
  prepareFirstScoreRow,
} from '../helpers/gameScoreHelpers';
import { GameScore } from '../types/game';
import { Player } from '../types/players';

interface GameStoreValues {
  scores: GameScore[];
}

interface GameStoreFunctions {
  initScore: (players: Player[]) => void;
  setNextScore: (players: Player[]) => void;
  reset: VoidFunction;
}

interface GameStore extends GameStoreValues, GameStoreFunctions {}

export const useGameStore = create<GameStore>((set) => ({
  scores: [],
  initScore: (players) =>
    set((state) => ({
      scores: prepareFirstScoreRow(state.scores, players),
    })),
  setNextScore: (players) =>
    set((state) => ({
      scores: [...state.scores, ...prepareEmptyScoreRow(state.scores, players)],
    })),
  reset: () =>
    set(() => ({
      scores: [],
    })),
}));
