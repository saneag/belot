import { useCallback } from "react";

import { useLocalization } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import { Button } from "@/components/ui/button";

import { useLoadPlayersNames } from "@/hooks/players-selection/useLoadPlayersNames";

export default function LoadPreviousGameButton() {
  const buttonMsg = useLocalization("load.previous.game.button");

  const hasPreviousGame = useGameStore((state) => state.hasPreviousGame);
  const loadPlayersNames = useLoadPlayersNames();

  const handleLoadPreviousGame = useCallback(() => {
    loadPlayersNames();
  }, [loadPlayersNames]);

  if (!hasPreviousGame) {
    return null;
  }

  return (
    <Button className="bg-primary/50 hover:bg-primary/80" onClick={handleLoadPreviousGame}>
      {buttonMsg}
    </Button>
  );
}
