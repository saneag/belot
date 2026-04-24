import { useLayoutEffect } from "react";

import { StorageKeys } from "@belot/constants";
import { useCheckForPreviousGame } from "@belot/hooks";

export const useLoadPreviousGame = () => {
  const checkForPreviousGame = useCheckForPreviousGame({
    getHasPreviousGame: () => localStorage.getItem(StorageKeys.hasPreviousGame) === "true",
  });

  useLayoutEffect(() => {
    void checkForPreviousGame();
  }, [checkForPreviousGame]);
};
