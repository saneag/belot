import { create } from 'zustand';

interface PlayersStoreValues {
  playersCount: number;
  playersNames: string[];
}

interface PlayersStoreFunctions {
  setPlayersCount: (playersCount: number) => void;
  setPlayersNames: (playersNames: string[]) => void;
  reset: VoidFunction;
}

interface PlayersStore extends PlayersStoreValues, PlayersStoreFunctions {}

export const usePlayersStore = create<PlayersStore>((set) => ({
  playersCount: 2,
  playersNames: [],
  setPlayersCount: (playersCount: number) => set(() => ({ playersCount })),
  setPlayersNames: (playersNames: string[]) => set(() => ({ playersNames })),
  reset: () => set(() => ({ playersCount: 2, playersNames: [] })),
}));
