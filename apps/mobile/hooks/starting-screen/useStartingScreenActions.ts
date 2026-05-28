import { useMemo } from "react";

import { useRouter } from "expo-router";

import { StorageKeys } from "@belot/constants";
import { useLoadGameData } from "@belot/hooks";
import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import { getFromStorage, removeFromStorage } from "@/helpers/storageHelpers";

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActions = (): StartingScreenAction[] => {
  const router = useRouter();

  useLoadGameData({ getFromStorage });

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const reset = useGameStore((state) => state.reset);

  const messages = useLocalizations([
    {
      key: "continue.last.game",
    },
    {
      key: "new.game",
    },
  ]);

  const hasUnfinishedGame = Boolean(players?.length && dealer && roundsScores?.length);

  const continueGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 0,
      label: messages.continueLastGame,
      isActive: hasUnfinishedGame,
      onPress: () => router.push("/game-table"),
    }),
    [messages.continueLastGame, router, hasUnfinishedGame],
  );

  const newGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 1,
      label: messages.newGame,
      isActive: true,
      onPress: () => {
        [StorageKeys.timerStartTime, StorageKeys.dealer, StorageKeys.roundsScores].forEach((key) =>
          removeFromStorage(key),
        );
        reset();
        router.push("/players-selection");
      },
    }),
    [messages.newGame, router, reset],
  );

  return [continueGameAction, newGameAction]
    .filter((action) => action.isActive)
    .sort((a, b) => a.index - b.index);
};
