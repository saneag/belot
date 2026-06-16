import { useCallback, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

interface UseHandleGameResetProps {
  navigateFunction: () => void;
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
  afterNavigate?: () => void;
}

export const useHandleGameReset = ({
  navigateFunction,
  setItemsToStorage,
  afterNavigate,
}: UseHandleGameResetProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const resetGame = useGameStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    await setItemsToStorage({
      [StorageKeys.timerStartTime]: "",
      [StorageKeys.roundsScores]: JSON.stringify([]),
      [StorageKeys.dealer]: "",
    });
    navigateFunction();
    if (afterNavigate) {
      afterNavigate();
    } else {
      resetGame();
    }
  }, [afterNavigate, navigateFunction, resetGame, setItemsToStorage]);

  return {
    handleReset,
    showDialog,
    setShowDialog,
  };
};
