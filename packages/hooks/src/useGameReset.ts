import { useCallback } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

export const GAME_RESET_STORAGE_KEYS = [
  StorageKeys.dealer,
  StorageKeys.roundsScores,
  StorageKeys.timerStartTime,
  StorageKeys.maxScore,
] as const satisfies StorageKeys[];

interface UseGameResetProps {
  navigateFunction: () => void;
  removeItemsFromStorage: (keys: StorageKeys[]) => Promise<void> | void;
  afterNavigate?: () => void;
  onComplete?: () => void;
}

export const useGameReset = ({
  navigateFunction,
  removeItemsFromStorage,
  afterNavigate,
  onComplete,
}: UseGameResetProps) => {
  const resetStore = useGameStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    await removeItemsFromStorage([...GAME_RESET_STORAGE_KEYS]);
    navigateFunction();
    if (afterNavigate) {
      afterNavigate();
    } else {
      resetStore();
    }
    onComplete?.();
  }, [afterNavigate, navigateFunction, onComplete, removeItemsFromStorage, resetStore]);

  return { handleReset };
};
