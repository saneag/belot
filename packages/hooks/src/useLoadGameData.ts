import { useEffect, useRef } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import type { Player, RoundScore } from "@belot/types";

interface UseLoadGameDataProps {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
}

export const useLoadGameData = ({ getFromStorage }: UseLoadGameDataProps) => {
  const hasFetchedData = useRef(false);

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const roundsScores = useGameStore((state) => state.roundsScores);

  const setPlayers = useGameStore((state) => state.setPlayers);
  const setDealer = useGameStore((state) => state.setDealer);
  const setRoundsScores = useGameStore((state) => state.setRoundsScores);

  useEffect(() => {
    if (
      !hasFetchedData.current &&
      (players?.length === 0 || dealer === null || roundsScores?.length === 0)
    ) {
      const fetchData = async () => {
        const storagePlayers = await getFromStorage(StorageKeys.players);
        const storageDealer = await getFromStorage(StorageKeys.dealer);
        const storageRoundsScores = await getFromStorage(StorageKeys.roundsScores);

        if (storagePlayers && storageDealer && storageRoundsScores) {
          setPlayers(JSON.parse(storagePlayers) as Player[]);
          setDealer(JSON.parse(storageDealer) as Player);
          setRoundsScores(JSON.parse(storageRoundsScores) as RoundScore[]);
        }
      };

      void fetchData();

      hasFetchedData.current = true;
    }
  }, [
    dealer,
    getFromStorage,
    players?.length,
    roundsScores?.length,
    setDealer,
    setPlayers,
    setRoundsScores,
  ]);
};
