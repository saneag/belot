import { StorageKeys } from '@/constants/storageKeys';
import { usePlayersStore } from '@/store/players';
import { useCallback, useEffect } from 'react';
import { convertToObject, getFromStorage } from '../helpers/storageHelpers';

export const useLoadPlayersNames = () => {
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const loadPlayersNamesFromStore = useCallback(async () => {
    try {
      const playersNames = await getFromStorage(StorageKeys.playersNames);

      if (!playersNames) {
        return;
      }

      setPlayersNames(convertToObject(playersNames));
    } catch (error) {
      console.error('Error in useLoadPlayersNames', error);
    }
  }, [setPlayersNames]);

  useEffect(() => {
    loadPlayersNamesFromStore();
  }, [loadPlayersNamesFromStore]);
};
