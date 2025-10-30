import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';
import { storeKeys } from '../constants/storeKeys';
import { usePlayersStore } from '../store/players';

export const useLoadPlayersNames = () => {
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const loadPlayersNamesFromStore = useCallback(async () => {
    try {
      const playersNames = await AsyncStorage.getItem(storeKeys.playersNames);

      if (!playersNames) {
        return;
      }

      setPlayersNames(JSON.parse(playersNames));
    } catch (error) {
      console.error('Error in useLoadPlayersNames', error);
    }
  }, [setPlayersNames]);

  useEffect(() => {
    loadPlayersNamesFromStore();
  }, [loadPlayersNamesFromStore]);
};
