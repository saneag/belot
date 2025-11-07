import { create } from 'zustand';
import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import { prepareEmptyScoreRow } from '../helpers/gameScoreHelpers';

interface GameStoreValues {
  score: Record<string, Record<string, string>>;
  roundPoints: number;
}

interface GameStoreFunctions {
  initScore: (playersCount: number) => void;
  setNextScore: (playersCount: number) => void;
  reset: VoidFunction;
  setRoundPoints: (roundPoints: number) => void;
  resetRoundPoints: VoidFunction;
}

interface GameStore extends GameStoreValues, GameStoreFunctions {}

export const useGameStore = create<GameStore>((set) => ({
  score: {},
  roundPoints: DEFAULT_ROUND_POINTS,
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
  reset: () => set(() => ({ score: {}, roundPoints: DEFAULT_ROUND_POINTS })),
  setRoundPoints: (roundPoints) => set(() => ({ roundPoints })),
  resetRoundPoints: () => set(() => ({ roundPoints: DEFAULT_ROUND_POINTS })),
}));
