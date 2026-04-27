import { useCallback, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import type { Player } from "@belot/types";

interface UseLoadPreviousGameProps {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
}

export const useLoadPreviousPlayers = ({ getFromStorage }: UseLoadPreviousGameProps) => {
  const [storagePlayers, setStoragePlayers] = useState<string | null>(null);

  const setPlayers = useGameStore((state) => state.setPlayers);

  const fetchPreviousPlayers = useCallback(async () => {
    try {
      const storagePlayers = await getFromStorage(StorageKeys.players);

      if (storagePlayers) {
        setStoragePlayers(storagePlayers);
      }
    } catch (error) {
      console.error("Error in useLoadPreviousPlayers", error);
    }
  }, [getFromStorage]);

  const loadPlayersNamesFromStorage = useCallback(() => {
    if (!storagePlayers) {
      return;
    }

    setPlayers(JSON.parse(storagePlayers) as Player[]);
  }, [setPlayers, storagePlayers]);

  return {
    storagePlayers,
    fetchPreviousPlayers,
    loadPlayersNamesFromStorage,
  };
};
