import { useCallback } from "react";

import { useFocusEffect } from "expo-router";

import { useLoadPreviousPlayers } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { Button, ButtonText } from "@/components/ui/button";

import { getFromStorage } from "@/helpers/storageHelpers";

export default function LoadPreviousGameButton() {
  const buttonMsg = useLocalization("load.previous.game.button");

  const { storagePlayers, fetchPreviousPlayers, loadPlayersNamesFromStorage } =
    useLoadPreviousPlayers({
      getFromStorage,
    });

  useFocusEffect(
    useCallback(() => {
      fetchPreviousPlayers();
    }, [fetchPreviousPlayers]),
  );

  if (!storagePlayers) {
    return null;
  }

  return (
    <Button variant="outline" onPress={loadPlayersNamesFromStorage}>
      <ButtonText>{buttonMsg}</ButtonText>
    </Button>
  );
}
