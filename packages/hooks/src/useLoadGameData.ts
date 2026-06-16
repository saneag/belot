import { useEffect, useRef, useState } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { GameMode, type Player, type RoundScore } from "@belot/types";
import {
  applyDefaultTotalRoundScore,
  getDefaultPointsType,
  parseStoredPointsType,
  repairRoundScoreScores,
} from "@belot/utils";

import { useIsPointsTypeEnabled } from "./usePointsTypeFeature";
import type { Settings } from "./useSettings";

interface UseLoadGameDataBaseProps {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  setToStorage?: (key: StorageKeys, value: string) => Promise<void> | void;
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
  setToStorage,
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
  const isPointsTypeEnabled = useIsPointsTypeEnabled();
  const getFromStorageRef = useRef(getFromStorage);
  const setToStorageRef = useRef(setToStorage);

  useEffect(() => {
    getFromStorageRef.current = getFromStorage;
  }, [getFromStorage]);

  useEffect(() => {
    setToStorageRef.current = setToStorage;
  }, [setToStorage]);

  useEffect(() => {
    const shouldFetchStorage =
      !hasFetchedData.current &&
      (!shouldSetData || players?.length === 0 || dealer === null || roundsScores?.length === 0);

    if (shouldFetchStorage) {
      const fetchData = async () => {
        const storagePlayers = await getFromStorageRef.current(StorageKeys.players);
        const storageDealer = await getFromStorageRef.current(StorageKeys.dealer);
        const storageRoundsScores = await getFromStorageRef.current(StorageKeys.roundsScores);
        const storageSettings = await getFromStorageRef.current(StorageKeys.settings);

        let parsedPointsType = getDefaultPointsType();

        if (storageSettings && isPointsTypeEnabled) {
          const storedPointsType = parseStoredPointsType(storageSettings);

          if (storedPointsType) {
            parsedPointsType = storedPointsType;

            if (parsedPointsType !== useGameStore.getState().pointsType) {
              setPointsType(parsedPointsType);
            }
          } else {
            const defaultSettings: Settings = { pointsType: getDefaultPointsType() };

            await setToStorageRef.current?.(StorageKeys.settings, JSON.stringify(defaultSettings));
          }
        }

        if (storagePlayers && storageDealer && storageRoundsScores) {
          const parsedPlayers = JSON.parse(storagePlayers) as Player[];
          const parsedDealer = JSON.parse(storageDealer) as Player;
          let parsedRoundsScores = JSON.parse(storageRoundsScores) as RoundScore[];

          if (parsedRoundsScores.length > 0) {
            const lastRoundIndex = parsedRoundsScores.length - 1;
            const gameMode = parsedPlayers.length === 4 ? GameMode.teams : GameMode.classic;

            parsedRoundsScores = [
              ...parsedRoundsScores.slice(0, lastRoundIndex),
              applyDefaultTotalRoundScore(
                repairRoundScoreScores(parsedRoundsScores[lastRoundIndex], {
                  players: parsedPlayers,
                  mode: gameMode,
                  pointsType: parsedPointsType,
                  roundsScores: parsedRoundsScores,
                }),
                parsedPointsType,
              ),
            ];
          }

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
    isPointsTypeEnabled,
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
