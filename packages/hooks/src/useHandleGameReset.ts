import { useCallback, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

interface UseHandleGameResetProps {
  navigateFunction: () => void;
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
}

export const useHandleGameReset = ({
  navigateFunction,
  setItemsToStorage,
}: UseHandleGameResetProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const resetGame = useGameStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    await setItemsToStorage({
      [StorageKeys.timerStartTime]: "",
      [StorageKeys.roundsScores]: JSON.stringify([]),
      [StorageKeys.dealer]: "",
    });
    resetGame();
    navigateFunction();
  }, [navigateFunction, resetGame, setItemsToStorage]);

  return {
    handleReset,
    showDialog,
    setShowDialog,
  };
};
