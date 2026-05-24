import { useMemo } from "react";

import { useRouter } from "expo-router";

import { useLocalizations } from "@belot/localizations";

interface StartingScreenAction {
  index: number;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const useStartingScreenActions = (): StartingScreenAction[] => {
  const router = useRouter();

  const messages = useLocalizations([
    {
      key: "continue.last.game",
    },
    {
      key: "new.game",
    },
  ]);

  const continueGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 0,
      label: messages.continueLastGame,
      isActive: false, // TODO: check if there's a game to continue
      onPress: () => router.push("/game-table"),
    }),
    [messages.continueLastGame, router],
  );

  const newGameAction = useMemo<StartingScreenAction>(
    () => ({
      index: 1,
      label: messages.newGame,
      isActive: true,
      onPress: () => router.push("/players-selection"),
    }),
    [messages.newGame, router],
  );

  return [continueGameAction, newGameAction]
    .filter((action) => action.isActive)
    .sort((a, b) => a.index - b.index);
};
