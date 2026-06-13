import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import { StorageKeys } from "@belot/constants";
import { useLoadGameData } from "@belot/hooks";
import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActions = (): StartingScreenAction[] => {
  const navigate = useNavigate();

  const { storagePlayers, storageDealer, storageRoundsScores } = useLoadGameData({
    getFromStorage: (key) => localStorage.getItem(key),
    shouldSetData: false,
  });
  const reset = useGameStore((state) => state.reset);

  const messages = useLocalizations([
    {
      key: "continue.last.game",
    },
    {
      key: "new.game",
    },
    {
      key: "settings",
    },
  ]);

  const hasUnfinishedGame = Boolean(
    storagePlayers?.length && storageDealer && storageRoundsScores?.length,
  );

  const continueGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 0,
      label: messages.continueLastGame,
      isActive: hasUnfinishedGame,
      onPress: () => void navigate("/game-table"),
    }),
    [messages.continueLastGame, navigate, hasUnfinishedGame],
  );

  const newGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 1,
      label: messages.newGame,
      isActive: true,
      onPress: () => {
        [StorageKeys.timerStartTime, StorageKeys.dealer, StorageKeys.roundsScores].forEach((key) =>
          localStorage.removeItem(key),
        );
        reset();
        void navigate("/players-selection");
      },
    }),
    [messages.newGame, navigate, reset],
  );

  const settingsAction = useMemo<StartingScreenAction>(
    () => ({
      index: 2,
      label: messages.settings,
      isActive: true,
      onPress: () => void navigate("/settings"),
    }),
    [messages.settings, navigate],
  );

  return [continueGameAction, newGameAction, settingsAction]
    .filter((action) => action.isActive)
    .sort((a, b) => a.index - b.index);
};
