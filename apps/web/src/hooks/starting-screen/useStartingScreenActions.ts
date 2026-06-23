import { useNavigate } from "react-router-dom";

import { useLoadGameData, useStartingScreenActionsHelper } from "@belot/hooks";

import { getFromStorage, removeFromStorage, setToStorage } from "@/helpers/storageHelpers";

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActions = (): StartingScreenAction[] => {
  const navigate = useNavigate();

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
          void navigate("/game-table");
          break;
        case "players-selection":
          void navigate("/players-selection");
          break;
        case "settings":
          void navigate("/settings");
          break;
        default:
          void navigate(path);
      }
    },
  });

  return startingScreenActions;
};
