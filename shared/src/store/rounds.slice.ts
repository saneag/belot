import { StateCreator } from 'zustand';
import {
  prepareEmptyRoundScoreRow,
  recalculateScoreOnRedo,
  recalculateScoreOnUndo,
  roundByLastDigit,
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
  skipRound: VoidFunction;
  undoRoundScore: VoidFunction;
  redoRoundScore: VoidFunction;
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

      const roundToUpdateIndex = state.roundsScores.findIndex(
        (rs) => rs.id === roundScoreId
      );

      if (roundToUpdateIndex === -1) return state;

      const updatedRoundsScores = [...state.roundsScores];

      updatedRoundsScores[roundToUpdateIndex] = {
        ...updatedRoundsScores[roundToUpdateIndex],
        ...restRoundScore,
      };

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
  skipRound: () =>
    set((state) => {
      const roundsScoresCount = state.roundsScores.length;

      if (roundsScoresCount === 0) return state;

      const lastIndex = roundsScoresCount - 1;
      const lastRoundScore = state.roundsScores[lastIndex];

      const updatedRoundsScores = [...state.roundsScores];

      updatedRoundsScores[lastIndex] = {
        ...lastRoundScore,
        totalRoundScore: roundByLastDigit(lastRoundScore.totalRoundScore),
      };

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
