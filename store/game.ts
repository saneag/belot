import { create } from 'zustand';
import { prepareEmptyScoreRow } from '../helpers/gameScoreHelpers';

interface GameStoreValues {
  score: Record<string, Record<string, string>>;
}

interface GameStoreFunctions {
  initScore: (playersCount: number) => void;
  setNextScore: (playersCount: number) => void;
  reset: VoidFunction;
}

interface GameStore extends GameStoreValues, GameStoreFunctions {}

export const useGameStore = create<GameStore>((set) => ({
  score: {},
  initScore: (playersCount) =>
    set(() => {
      return {
        score: prepareEmptyScoreRow(playersCount, 0),
      };
    }),
  setNextScore: (playersCount) =>
    set((state) => {
      const rawRowIndex = Object.keys(state.score).at(-1);
      const rowIndex = rawRowIndex ? Number(rawRowIndex) + 1 : 0;

      return {
        score: {
          ...state.score,
          ...prepareEmptyScoreRow(playersCount, Number(rowIndex)),
        },
      };
    }),
  reset: () => set(() => ({ score: {} })),
}));
