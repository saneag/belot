import { create } from 'zustand';
import { prepareEmptyScoreRow } from '../helpers/gameScoreHelpers';
import { GameScore } from '../types/game';

interface GameStoreValues {
  score: GameScore;
  currentRound: number;
  dealers: Record<number, string>;
}

interface GameStoreFunctions {
  initScore: (playersCount: number) => void;
  setNextScore: (playersCount: number) => void;
  reset: VoidFunction;
  setCurrentRound: (roundNumber: number) => void;
  updateScore: (score: GameScore) => void;
  setDealers: (dealer: Record<number, string>) => void;
}

interface GameStore extends GameStoreValues, GameStoreFunctions {}

export const useGameStore = create<GameStore>((set) => ({
  score: {},
  currentRound: 0,
  dealers: {},
  initScore: (playersCount) =>
    set(() => ({
      score: prepareEmptyScoreRow(playersCount, 0),
    })),
  setNextScore: (playersCount) =>
    set((state) => {
      const rawRowIndex = Object.keys(state.score).at(-1);
      const rowIndex = rawRowIndex ? Number(rawRowIndex) + 1 : 0;

      return {
        score: {
          ...state.score,
          ...prepareEmptyScoreRow(playersCount, Number(rowIndex)),
        },
        currentRound: rowIndex,
      };
    }),
  reset: () =>
    set(() => ({
      score: {},
      currentRound: 0,
    })),
  setCurrentRound: (currentRound) => set(() => ({ currentRound })),
  updateScore: (score) =>
    set((state) => ({ score: { ...state.score, ...score } })),
  setDealers: (dealer) =>
    set((state) => ({ dealers: { ...state.dealers, ...dealer } })),
}));
