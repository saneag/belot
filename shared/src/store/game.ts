import { create } from 'zustand';
import { GameMode } from '../types';
import { createGameSlice, GameSlice } from './game.slice';
import { createPlayersSlice, PlayersSlice } from './players.slice';
import { createRoundSlice, RoundSlice } from './rounds.slice';

interface GameStore extends GameSlice, PlayersSlice, RoundSlice {
  reset: VoidFunction;
}

export const useGameStore = create<GameStore>((set, ...rest) => ({
  ...createPlayersSlice(set, ...rest),
  ...createRoundSlice(set, ...rest),
  ...createGameSlice(set, ...rest),

  reset: () =>
    set(() => ({
      players: [],
      mode: GameMode.classic,
      dealer: null,
      roundPlayer: null,
      roundsScores: [],
      teams: [],
    })),
}));
