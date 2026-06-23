import { useLayoutEffect } from "react";

import { useLoadPreviousPlayers } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { Button } from "@/components/ui/button";

import { getFromStorage } from "@/helpers/storageHelpers";

export default function LoadPreviousGameButton() {
  const buttonMsg = useLocalization("load.previous.game.button");

  const { storagePlayers, fetchPreviousPlayers, loadPlayersNamesFromStorage } =
    useLoadPreviousPlayers({ getFromStorage });

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
