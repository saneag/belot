import { useCallback } from "react";

import { useGameStore } from "@belot/store";

interface UseCheckForPreviousGameProps {
  getHasPreviousGame: () => Promise<boolean> | boolean;
}

export const useCheckForPreviousGame = ({ getHasPreviousGame }: UseCheckForPreviousGameProps) => {
  const setHasPreviousGame = useGameStore((state) => state.setHasPreviousGame);

  const checkForPreviousGame = useCallback(async () => {
    try {
      const hasPreviousGame = await getHasPreviousGame();

      setHasPreviousGame(hasPreviousGame);
    } catch (error) {
      console.warn("Error while checking for previous game data", error);
    }
  }, [getHasPreviousGame, setHasPreviousGame]);

  return checkForPreviousGame;
};
