import { useLayoutEffect } from "react";

import { useLoadPreviousPlayers } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { Button } from "@/components/ui/button";

export default function LoadPreviousGameButton() {
  const buttonMsg = useLocalization("load.previous.game.button");

  const { storagePlayers, fetchPreviousPlayers, loadPlayersNamesFromStorage } =
    useLoadPreviousPlayers({
      getFromStorage: (key) => localStorage.getItem(key),
    });

  useLayoutEffect(() => {
    void fetchPreviousPlayers();
  }, [fetchPreviousPlayers]);

  if (!storagePlayers) {
    return null;
  }

  return (
    <Button className="bg-primary/50 hover:bg-primary/80" onClick={loadPlayersNamesFromStorage}>
      {buttonMsg}
    </Button>
  );
}
