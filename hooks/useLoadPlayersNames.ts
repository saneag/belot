import { StorageKeys } from '@/constants/storageKeys';
import { usePlayersStore } from '@/store/players';
import { useCallback } from 'react';
import { convertToObject, getFromStorage } from '../helpers/storageHelpers';

export const useLoadPlayersNames = () => {
  const setPlayersCount = usePlayersStore((state) => state.setPlayersCount);
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const loadPlayersNamesFromStore = useCallback(async () => {
    try {
      const playersCount = await getFromStorage(StorageKeys.playersCount);
      const playersNames = await getFromStorage(StorageKeys.playersNames);

      if (!playersCount || !playersNames) {
        return;
      }

      setPlayersCount(convertToObject(playersCount));
      setPlayersNames(convertToObject(playersNames));
    } catch (error) {
      console.error('Error in useLoadPlayersNames', error);
    }
  }, [setPlayersCount, setPlayersNames]);

  return loadPlayersNamesFromStore;
};
