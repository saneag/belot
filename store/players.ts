import { create } from 'zustand';

interface PlayersStoreValues {
  playersCount: number;
  playersNames: Record<string, string>;
  hasPreviousGame: boolean;
}

interface PlayersStoreFunctions {
  setPlayersCount: (playersCount: number) => void;
  setPlayersNames: (playersNames: Record<string, string>) => void;
  setHasPreviousGame: (hasPreviousGame: boolean) => void;
  reset: VoidFunction;
}

interface PlayersStore extends PlayersStoreValues, PlayersStoreFunctions {}

export const usePlayersStore = create<PlayersStore>((set) => ({
  playersCount: 2,
  playersNames: {
    '0': '',
    '1': '',
    '2': '',
    '3': '',
  },
  hasPreviousGame: false,
  setPlayersCount: (playersCount: number) => set(() => ({ playersCount })),
  setPlayersNames: (playersNames: Record<string, string>) =>
    set((state) => ({
      playersNames: { ...state.playersNames, ...playersNames },
    })),
  setHasPreviousGame: (hasPreviousGame) => set(() => ({ hasPreviousGame })),
  reset: () =>
    set(() => ({
      playersCount: 2,
      playersNames: {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
      },
    })),
}));
