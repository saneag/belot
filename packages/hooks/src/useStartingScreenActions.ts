import { useMemo } from "react";

import { StorageKeys } from "@belot/constants";
import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";
import type { Player, RoundScore } from "@belot/types";

import { useFeatureToggle } from "./featureToggles/useFeatureToggle";

interface UseStartingScreenActionsHelperProps {
  storagePlayers: Player[] | null;
  storageDealer: Player | null;
  storageRoundsScores: RoundScore[] | null;
  removeFromStorage: (key: StorageKeys) => Promise<void> | void;
  navigate: (path: string) => void;
}

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActionsHelper = ({
  storagePlayers,
  storageDealer,
  storageRoundsScores,
  removeFromStorage,
  navigate,
}: UseStartingScreenActionsHelperProps) => {
  const reset = useGameStore((state) => state.reset);
  const isSettingsScreenEnabled = useFeatureToggle("settings-screen");

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
      onPress: () => void navigate("game-table"),
    }),
    [messages.continueLastGame, navigate, hasUnfinishedGame],
  );

  const newGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 1,
      label: messages.newGame,
      isActive: true,
      onPress: () => {
        [StorageKeys.timerStartTime, StorageKeys.dealer, StorageKeys.roundsScores].forEach(
          (key) => void removeFromStorage(key),
        );
        reset();
        void navigate("players-selection");
      },
    }),
    [messages.newGame, navigate, removeFromStorage, reset],
  );

  const settingsAction = useMemo<StartingScreenAction>(
    () => ({
      index: 2,
      label: messages.settings,
      isActive: isSettingsScreenEnabled,
      onPress: () => void navigate("settings"),
    }),
    [messages.settings, navigate, isSettingsScreenEnabled],
  );

  return [continueGameAction, newGameAction, settingsAction]
    .filter((action) => action.isActive)
    .sort((a, b) => a.index - b.index);
};
