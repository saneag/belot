import { type GameSlice, type PlayersSlice, type RoundSlice } from "@belot/types";
import {
  normalizeSkippedRoundScore,
  prepareEmptyRoundScoreRow,
  recalculateScoreOnRedo,
  recalculateScoreOnUndo,
  setNextDealer,
} from "@belot/utils/src";

import { type StateCreator } from "zustand";

const normalizeRoundsScores = (roundsScores: RoundSlice["roundsScores"]) =>
  Array.isArray(roundsScores) ? roundsScores : [];

export const createRoundSlice: StateCreator<
  RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
> = (set) => ({
  dealer: null,
  roundsScores: [],
  undoneRoundsScores: [],

  setDealer: (dealer) => set(() => ({ dealer })),
  setEmptyRoundScore: () =>
    set((state) => ({
      roundsScores: [...state.roundsScores, prepareEmptyRoundScoreRow(state)],
      ...setNextDealer(state),
      undoneRoundsScores: [],
    })),
  setRoundsScores: (roundsScores) =>
    set((state) => {
      const normalizedRoundsScores = normalizeRoundsScores(roundsScores);

      return {
        roundsScores: normalizedRoundsScores,
        ...setNextDealer(state),
      };
    }),
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
      const pointsType = state.pointsType ?? "micropoints";

      const updatedRoundsScores = [...state.roundsScores];

      updatedRoundsScores[lastIndex] = {
        ...lastRoundScore,
        totalRoundScore: normalizeSkippedRoundScore(lastRoundScore.totalRoundScore, pointsType),
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
