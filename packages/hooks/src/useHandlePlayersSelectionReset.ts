import { useCallback } from "react";

import { useGameStore } from "@belot/store";

import { usePlayersSelectionContext } from "./usePlayersSelectionContext";

export const useHandlePlayersSelectionResetButton = () => {
  const { resetValidations } = usePlayersSelectionContext();
  const resetGameStore = useGameStore((state) => state.reset);

  const handleReset = useCallback(() => {
    resetGameStore();
    resetValidations();
  }, [resetGameStore, resetValidations]);

  return handleReset;
};
