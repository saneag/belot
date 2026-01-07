import { StateCreator } from 'zustand';
import {
  prepareEmptyRoundScoreRow,
  recalculateScoreOnRedo,
  recalculateScoreOnUndo,
  setNextDealer,
} from '../utils';
import { Player, RoundScore } from '../types';
import { GameSlice } from './game.slice';
import { PlayersSlice } from './players.slice';

export interface RoundSlice {
  dealer: Player | null;
  roundPlayer: Player | null;
  roundsScores: RoundScore[];
  undoneRoundsScores: RoundScore[];

  setDealer: (dealer: Player | null) => void;
  setRoundPlayer: (roundPlayer: Player | null) => void;
  setRoundsScores: (roundsScores: RoundScore[]) => void;
  updateRoundScore: (roundScore: Partial<RoundScore>) => void;
  setEmptyRoundScore: VoidFunction;
  undoRoundScore: () => void;
  redoRoundScore: () => void;
}

export const createRoundSlice: StateCreator<
  RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
> = (set) => ({
  dealer: null,
  roundPlayer: null,
  roundsScores: [],
  undoneRoundsScores: [],

  setDealer: (dealer) => set(() => ({ dealer })),
  setRoundPlayer: (roundPlayer) => set(() => ({ roundPlayer })),
  setEmptyRoundScore: () =>
    set((state) => ({
      roundsScores: [...state.roundsScores, prepareEmptyRoundScoreRow(state)],
      ...setNextDealer(state),
      undoneRoundsScores: [],
    })),
  setRoundsScores: (roundsScores) =>
    set((state) => ({ roundsScores, ...setNextDealer(state) })),
  updateRoundScore: (roundScore) =>
    set((state) => {
      const { id: roundScoreId, ...restRoundScore } = roundScore;

      const updatedRoundsScores = state.roundsScores.map((stateRoundScore) =>
        stateRoundScore.id === roundScoreId
          ? { ...stateRoundScore, ...restRoundScore }
          : stateRoundScore
      );

      const newEmptyRow = prepareEmptyRoundScoreRow({
        ...state,
        roundsScores: updatedRoundsScores,
      });

      return {
        roundsScores: [...updatedRoundsScores, newEmptyRow],
        ...setNextDealer(state),
        undoneRoundsScores: [],
      };
    }),
  undoRoundScore: () =>
    set((state) => ({
      ...recalculateScoreOnUndo(state),
    })),
  redoRoundScore: () =>
    set((state) => ({
      ...recalculateScoreOnRedo(state),
    })),
});
