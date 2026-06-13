import { useEffect, useRef, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import type { Player, RoundScore } from "@belot/types";

interface UseLoadGameDataBaseProps {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
}

interface UseLoadGameDataSetProps extends UseLoadGameDataBaseProps {
  shouldSetData?: true;
}

interface UseLoadGameDataReadProps extends UseLoadGameDataBaseProps {
  shouldSetData?: boolean;
}

interface UseLoadGameDataStorageResult {
  storagePlayers: Player[] | null;
  storageDealer: Player | null;
  storageRoundsScores: RoundScore[] | null;
}

export function useLoadGameData(
  props: UseLoadGameDataReadProps & { shouldSetData: false },
): UseLoadGameDataStorageResult;
export function useLoadGameData(props: UseLoadGameDataSetProps): null;

export function useLoadGameData({
  getFromStorage,
  shouldSetData = true,
}: UseLoadGameDataSetProps | (UseLoadGameDataReadProps & { shouldSetData: false })) {
  const hasFetchedData = useRef(false);

  const [storagePlayers, setStoragePlayers] = useState<Player[] | null>(null);
  const [storageDealer, setStorageDealer] = useState<Player | null>(null);
  const [storageRoundsScores, setStorageRoundsScores] = useState<RoundScore[] | null>(null);

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const roundsScores = useGameStore((state) => state.roundsScores);

  const setPlayers = useGameStore((state) => state.setPlayers);
  const setDealer = useGameStore((state) => state.setDealer);
  const setRoundsScores = useGameStore((state) => state.setRoundsScores);

  useEffect(() => {
    const shouldFetchStorage =
      !hasFetchedData.current &&
      (!shouldSetData || players?.length === 0 || dealer === null || roundsScores?.length === 0);

    if (shouldFetchStorage) {
      const fetchData = async () => {
        const storagePlayers = await getFromStorage(StorageKeys.players);
        const storageDealer = await getFromStorage(StorageKeys.dealer);
        const storageRoundsScores = await getFromStorage(StorageKeys.roundsScores);

        if (storagePlayers && storageDealer && storageRoundsScores) {
          if (shouldSetData) {
            setPlayers(JSON.parse(storagePlayers) as Player[]);
            setDealer(JSON.parse(storageDealer) as Player);
            setRoundsScores(JSON.parse(storageRoundsScores) as RoundScore[]);

            return;
          }

          setStoragePlayers(JSON.parse(storagePlayers) as Player[]);
          setStorageDealer(JSON.parse(storageDealer) as Player);
          setStorageRoundsScores(JSON.parse(storageRoundsScores) as RoundScore[]);
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
    shouldSetData,
  ]);

  return !shouldSetData
    ? {
        storagePlayers,
        storageDealer,
        storageRoundsScores,
      }
    : null;
}
