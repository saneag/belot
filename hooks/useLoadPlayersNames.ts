import { StorageKeys } from '@/constants/storageKeys';
import { usePlayersStore } from '@/store/players';
import { useCallback } from 'react';
import { getFromStorage } from '../helpers/storageHelpers';

export const useLoadPlayersNames = () => {
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const loadPlayersNamesFromStore = useCallback(async () => {
    try {
      const players = await getFromStorage(StorageKeys.players);

      if (!players) {
        return;
      }

      setPlayers(JSON.parse(players));
    } catch (error) {
      console.error('Error in useLoadPlayersNames', error);
    }
  }, [setPlayers]);

  return loadPlayersNamesFromStore;
};
