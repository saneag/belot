import { useEffect, useRef, useState } from "react";

import { POINTS_TYPE, StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import type { Player, RoundScore } from "@belot/types";
import type { Settings } from "./useSettings";

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
  const setPointsType = useGameStore((state) => state.setPointsType);

  useEffect(() => {
    const shouldFetchStorage =
      !hasFetchedData.current &&
      (!shouldSetData || players?.length === 0 || dealer === null || roundsScores?.length === 0);

    if (shouldFetchStorage) {
      const fetchData = async () => {
        const storagePlayers = await getFromStorage(StorageKeys.players);
        const storageDealer = await getFromStorage(StorageKeys.dealer);
        const storageRoundsScores = await getFromStorage(StorageKeys.roundsScores);
        const storageSettings = await getFromStorage(StorageKeys.settings);

        if (storageSettings) {
          try {
            const parsedSettings = JSON.parse(storageSettings) as Settings;
            const isValidPointsType = POINTS_TYPE.some((type) => type.id === parsedSettings.pointsType);

            if (isValidPointsType) {
              setPointsType(parsedSettings.pointsType);
            }
          } catch {
            // Ignore invalid settings payloads and keep the default points type.
          }
        }

        if (storagePlayers && storageDealer && storageRoundsScores) {
          const parsedPlayers = JSON.parse(storagePlayers) as Player[];
          const parsedDealer = JSON.parse(storageDealer) as Player;
          const parsedRoundsScores = JSON.parse(storageRoundsScores) as RoundScore[];

          if (shouldSetData) {
            setPlayers(parsedPlayers);
            setRoundsScores(parsedRoundsScores);
            setDealer(parsedDealer);

            return;
          }

          setStoragePlayers(parsedPlayers);
          setStorageDealer(parsedDealer);
          setStorageRoundsScores(parsedRoundsScores);
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
    setPointsType,
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
