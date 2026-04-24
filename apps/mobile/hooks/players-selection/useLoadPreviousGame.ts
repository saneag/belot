import { useCallback } from "react";

import { useFocusEffect } from "expo-router";

import { StorageKeys } from "@belot/constants";
import { useCheckForPreviousGame } from "@belot/hooks";

import { getFromStorage } from "@/helpers/storageHelpers";

export const useLoadPreviousGame = () => {
  const checkForPreviousGame = useCheckForPreviousGame({
    getHasPreviousGame: async () => (await getFromStorage(StorageKeys.hasPreviousGame)) === "true",
  });

  useFocusEffect(
    useCallback(() => {
      checkForPreviousGame();
    }, [checkForPreviousGame]),
  );
};
