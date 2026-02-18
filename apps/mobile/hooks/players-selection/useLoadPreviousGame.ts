import { useCallback } from "react";

import { useFocusEffect } from "expo-router";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

import { getFromStorage } from "@/helpers/storageHelpers";

export const useLoadPreviousGame = () => {
  const setHasPreviousGame = useGameStore((state) => state.setHasPreviousGame);

  const checkForPreviousGame = useCallback(async () => {
    try {
      const hasPreviousGame = await getFromStorage(StorageKeys.hasPreviousGame);

      setHasPreviousGame(hasPreviousGame === "true");
    } catch (error) {
      console.warn("Error while checking for previous game data", error);
    }
  }, [setHasPreviousGame]);

  useFocusEffect(
    useCallback(() => {
      checkForPreviousGame();
    }, [checkForPreviousGame]),
  );
};
