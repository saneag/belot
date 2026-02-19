import { GameSlice, PlayersSlice, RoundSlice } from "@belot/types";
import {
  prepareEmptyRoundScoreRow,
  recalculateScoreOnRedo,
  recalculateScoreOnUndo,
  roundByLastDigit,
  setNextDealer,
} from "@belot/utils";

import { StateCreator } from "zustand";

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
  setRoundsScores: (roundsScores) => set((state) => ({ roundsScores, ...setNextDealer(state) })),
  updateRoundScore: (roundScore) =>
    set((state) => {
      const { id: roundScoreId, ...restRoundScore } = roundScore;

      const roundToUpdateIndex = state.roundsScores.findIndex((rs) => rs.id === roundScoreId);

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
