import { useState } from "react";

import { StorageKeys } from "@belot/constants";

import { useGameReset } from "./useGameReset";

interface UseHandleGameResetProps {
  navigateFunction: () => void;
  removeItemsFromStorage: (keys: StorageKeys[]) => Promise<void> | void;
  afterNavigate?: () => void;
}

export const useHandleGameReset = ({
  navigateFunction,
  removeItemsFromStorage,
  afterNavigate,
}: UseHandleGameResetProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const { handleReset } = useGameReset({ navigateFunction, removeItemsFromStorage, afterNavigate });

  return {
    handleReset,
    showDialog,
    setShowDialog,
  };
};
