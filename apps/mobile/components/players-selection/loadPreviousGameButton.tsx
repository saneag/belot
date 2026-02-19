import { useCallback } from "react";

import { useGameStore } from "@belot/store";

import { Button, ButtonText } from "@/components/ui/button";

import { useLoadPlayersNames } from "@/hooks/players-selection/useLoadPlayersNames";
import { useLocalization } from "@/localizations/useLocalization";

export default function LoadPreviousGameButton() {
  const buttonMsg = useLocalization("load.previous.game.button");

  const hasPreviousGame = useGameStore((state) => state.hasPreviousGame);
  const loadPlayersNames = useLoadPlayersNames();

  const handleLoadPreviousGame = useCallback(async () => {
    await loadPlayersNames();
  }, [loadPlayersNames]);

  if (!hasPreviousGame) {
    return null;
  }

  return (
    <Button variant="outline" onPress={handleLoadPreviousGame}>
      <ButtonText>{buttonMsg}</ButtonText>
    </Button>
  );
}
