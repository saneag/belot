import { useRouter } from "expo-router";

import { useLoadGameData, useStartingScreenActionsHelper } from "@belot/hooks";

import { getFromStorage, removeFromStorage, setToStorage } from "@/helpers/storageHelpers";

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActions = (): StartingScreenAction[] => {
  const router = useRouter();

  const gameData = useLoadGameData({
    getFromStorage,
    setToStorage,
    shouldSetData: false,
  });

  const startingScreenActions = useStartingScreenActionsHelper({
    ...gameData,
    removeFromStorage,
    navigate: (path: string) => {
      switch (path) {
        case "game-table":
          router.push("/game-table");
          break;
        case "players-selection":
          router.push("/players-selection");
          break;
        case "settings":
          router.push("/settings-screen");
          break;
        default:
          throw new Error(`Unknown navigation path: ${path}`);
      }
    },
  });

  return startingScreenActions;
};
