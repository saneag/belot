import { useEffect, useRef } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { GameMode, type Player, type RoundScore } from "@belot/types";
import { prepareEmptyRoundScoreRow } from "@belot/utils";

interface UseLoadGameDataProps {
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
}

const isPlayer = (value: unknown): value is Player =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Player).id === "number" &&
  typeof (value as Player).name === "string";

const isRoundScoreArray = (value: unknown): value is RoundScore[] => Array.isArray(value);

const parseStoredJson = (value: string | null): unknown => {
  if (!value) return null;

  let parsed: unknown = value;

  for (let index = 0; index < 2 && typeof parsed === "string"; index += 1) {
    parsed = JSON.parse(parsed);
  }

  return parsed;
};

const getGameMode = (players: Player[]) => (players.length === 4 ? GameMode.teams : GameMode.classic);

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
        try {
          const storagePlayers = await getFromStorage(StorageKeys.players);
          const storageDealer = await getFromStorage(StorageKeys.dealer);
          const storageRoundsScores = await getFromStorage(StorageKeys.roundsScores);

          if (storagePlayers) {
            const parsedPlayers = parseStoredJson(storagePlayers);
            const parsedDealer = parseStoredJson(storageDealer);
            const parsedRoundsScores = parseStoredJson(storageRoundsScores);

            if (Array.isArray(parsedPlayers)) {
              const normalizedPlayers = parsedPlayers.filter(isPlayer);
              const normalizedDealer = isPlayer(parsedDealer)
                ? parsedDealer
                : normalizedPlayers[0] || null;
              const gameMode = getGameMode(normalizedPlayers);
              const normalizedRoundsScores = isRoundScoreArray(parsedRoundsScores)
                ? parsedRoundsScores
                : [];

              const fallbackRoundsScores =
                normalizedPlayers.length > 0 && normalizedDealer
                  ? [
                      prepareEmptyRoundScoreRow({
                        players: normalizedPlayers,
                        dealer: normalizedDealer,
                        mode: gameMode,
                      }),
                    ]
                  : [];

              setPlayers(normalizedPlayers);
              setDealer(normalizedDealer);
              setRoundsScores(
                normalizedRoundsScores.length > 0 ? normalizedRoundsScores : fallbackRoundsScores,
              );
            }
          }
        } catch (error) {
          console.error("Error in useLoadGameData", error);
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
