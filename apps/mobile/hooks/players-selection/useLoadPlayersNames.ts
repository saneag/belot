import { useCallback } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";

import { getFromStorage } from "@/helpers/storageHelpers";

export const useLoadPlayersNames = () => {
  const setPlayers = useGameStore((state) => state.setPlayers);

  const loadPlayersNamesFromStore = useCallback(async () => {
    try {
      const players = await getFromStorage(StorageKeys.players);

      if (!players) {
        return;
      }

      setPlayers(JSON.parse(players));
    } catch (error) {
      console.error("Error in useLoadPlayersNames", error);
    }
  }, [setPlayers]);

  return loadPlayersNamesFromStore;
};
