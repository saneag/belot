import { StateCreator } from 'zustand';
import {
  prepareEmptyRoundScoreRow,
  setNextDealer,
} from '../helpers/gameScoreHelpers';
import { Player, RoundScore } from '../types/game';
import { GameSlice } from './game.slice';
import { PlayersSlice } from './players.slice';

export interface RoundSlice {
  dealer: Player | null;
  roundPlayer: Player | null;
  roundsScores: RoundScore[];

  setDealer: (dealer: Player | null) => void;
  setRoundPlayer: (roundPlayer: Player | null) => void;
  setRoundsScores: (roundsScores: RoundScore[]) => void;
  updateRoundScore: (
    roundScoreId: number,
    roundScore: Partial<Omit<RoundScore, 'id'>>
  ) => void;
  setEmptyRoundScore: VoidFunction;
}

export const createRoundSlice: StateCreator<
  RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
> = (set) => ({
  dealer: null,
  roundPlayer: null,
  roundsScores: [],

  setDealer: (dealer) => set(() => ({ dealer })),
  setRoundPlayer: (roundPlayer) => set(() => ({ roundPlayer })),
  setEmptyRoundScore: () =>
    set((state) => ({
      roundsScores: [...state.roundsScores, prepareEmptyRoundScoreRow(state)],
      ...setNextDealer(state),
    })),
  setRoundsScores: (roundsScores) =>
    set((state) => ({ roundsScores, ...setNextDealer(state) })),
  updateRoundScore: (roundScoreId, roundScore) =>
    set((state) => ({
      roundsScores: state.roundsScores.map((stateRoundScore) =>
        stateRoundScore.id === roundScoreId
          ? { ...stateRoundScore, ...roundScore }
          : stateRoundScore
      ),
      ...setNextDealer(state),
    })),
});
