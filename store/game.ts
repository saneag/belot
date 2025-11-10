import { create } from 'zustand';
import { prepareEmptyScoreRow } from '../helpers/gameScoreHelpers';
import { GameScore } from '../types/game';

interface GameStoreValues {
  score: GameScore;
  currentRound: number;
  roundPlayers: Record<number, string>;
}

interface GameStoreFunctions {
  initScore: (playersCount: number) => void;
  setNextScore: (playersCount: number) => void;
  reset: VoidFunction;
  setCurrentRound: (roundNumber: number) => void;
  setRoundPlayers: (dealer: Record<number, string>) => void;
}

interface GameStore extends GameStoreValues, GameStoreFunctions {}

export const useGameStore = create<GameStore>((set) => ({
  score: {},
  currentRound: 0,
  roundPlayers: {},
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
  setRoundPlayers: (dealer) =>
    set((state) => ({ roundPlayers: { ...state.roundPlayers, ...dealer } })),
}));
