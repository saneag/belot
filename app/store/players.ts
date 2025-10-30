import { create } from 'zustand';

interface PlayersStoreValues {
  playersCount: number;
  playersNames: Record<string, string>;
}

interface PlayersStoreFunctions {
  setPlayersCount: (playersCount: number) => void;
  setPlayersNames: (playersNames: Record<string, string>) => void;
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
  setPlayersCount: (playersCount: number) => set(() => ({ playersCount })),
  setPlayersNames: (playersNames: Record<string, string>) =>
    set((state) => ({
      playersNames: { ...state.playersNames, ...playersNames },
    })),
  reset: () => set(() => ({ playersCount: 2, playersNames: {} })),
}));
