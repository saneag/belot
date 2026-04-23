import { useCallback, useLayoutEffect } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

export const useLoadPreviousGame = () => {
  const setHasPreviousGame = useGameStore((state) => state.setHasPreviousGame);

  const checkForPreviousGame = useCallback(() => {
    try {
      const hasPreviousGame = localStorage.getItem(StorageKeys.hasPreviousGame);

      setHasPreviousGame(hasPreviousGame === "true");
    } catch (error) {
      console.warn("Error while checking for previous game data", error);
    }
  }, [setHasPreviousGame]);

  useLayoutEffect(() => {
    void checkForPreviousGame();
  }, [checkForPreviousGame]);
};
