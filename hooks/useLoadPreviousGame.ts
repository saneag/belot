import { useCallback, useEffect } from 'react';
import { StorageKeys } from '../constants/storageKeys';
import { getFromStorage } from '../helpers/storageHelpers';
import { usePlayersStore } from '../store/players';

export const useLoadPreviousGame = () => {
  const hasPreviousGameState = usePlayersStore(
    (state) => state.hasPreviousGame
  );
  const setHasPreviousGame = usePlayersStore(
    (state) => state.setHasPreviousGame
  );

  const checkForPreviousGame = useCallback(async () => {
    try {
      const hasPreviousGame = await getFromStorage(StorageKeys.hasPreviousGame);

      if (hasPreviousGame) {
        setHasPreviousGame(true);
      }
    } catch (error) {
      console.warn('Error while checking for previous game data', error);
    }
  }, [setHasPreviousGame]);

  useEffect(() => {
    if (!hasPreviousGameState) {
      checkForPreviousGame();
    }
  }, [checkForPreviousGame, hasPreviousGameState]);
};
