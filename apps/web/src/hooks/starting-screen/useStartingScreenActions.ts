import { useNavigate } from "react-router-dom";

import { useLoadGameData, useStartingScreenActionsHelper } from "@belot/hooks";

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActions = (): StartingScreenAction[] => {
  const navigate = useNavigate();

  const gameData = useLoadGameData({
    getFromStorage: (key) => localStorage.getItem(key),
    shouldSetData: false,
  });

  const startingScreenActions = useStartingScreenActionsHelper({
    ...gameData,
    removeFromStorage: (key) => localStorage.removeItem(key),
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
