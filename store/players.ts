import { create } from 'zustand';

interface PlayersStoreValues {
  playersCount: number;
  playersNames: Record<string, string>;
  hasPreviousGame: boolean;
  dealer: number;
  isTeamVsTeam: boolean;
}

interface PlayersStoreFunctions {
  setPlayersCount: (playersCount: number) => void;
  setPlayersNames: (playersNames: Record<string, string>) => void;
  setHasPreviousGame: (hasPreviousGame: boolean) => void;
  reset: VoidFunction;
  setDealer: (dealer: number) => void;
}

interface PlayersStore extends PlayersStoreValues, PlayersStoreFunctions {}

export const usePlayersStore = create<PlayersStore>((set) => ({
  playersCount: 2,
  playersNames: {},
  hasPreviousGame: false,
  dealer: 0,
  isTeamVsTeam: false,
  setPlayersCount: (playersCount: number) =>
    set(() => ({ playersCount, isTeamVsTeam: playersCount === 4 })),
  setPlayersNames: (playersNames: Record<string, string>) =>
    set(() => ({ playersNames })),
  setHasPreviousGame: (hasPreviousGame) => set(() => ({ hasPreviousGame })),
  reset: () =>
    set(() => ({
      playersCount: 2,
      playersNames: {},
      dealer: 0,
      isTeamVsTeam: false,
    })),
  setDealer: (dealer) => set(() => ({ dealer })),
}));
