import { useCallback } from "react";

import { useRouter } from "expo-router";

import { useGameInit } from "@belot/api-client";
import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { GameMode } from "@belot/types";
import { isPlayerNameValid, prepareTeams, validatePlayersNames } from "@belot/utils/src";

import { usePlayersSelectionContext } from "@/components/players-selection/playersSelectionContext";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { setMultipleItemsToStorage } from "@/helpers/storageHelpers";

export default function usePlayersSubmit() {
  const router = useRouter();
  const { setValidations } = usePlayersSelectionContext();

  const initGame = useGameInit(getApiBaseUrl());

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const setEmptyRoundScore = useGameStore((state) => state.setEmptyRoundScore);
  const setGameId = useGameStore((state) => state.setGameId);

  const handleOpenDialog = useCallback(
    (showDialog: VoidFunction) => {
      const validation = validatePlayersNames(players);

      setValidations(validation);

      if (!isPlayerNameValid(validation)) {
        return;
      }

      showDialog();
    },
    [players, setValidations],
  );

  const handleSubmit = useCallback(async () => {
    const validation = validatePlayersNames(players);

    setValidations(validation);

    if (!isPlayerNameValid(validation)) {
      return;
    }

    await setMultipleItemsToStorage({
      [StorageKeys.players]: players,
      [StorageKeys.hasPreviousGame]: true,
    });

    const mode = players.length === 4 ? GameMode.teams : GameMode.classic;

    const gameInitResponse = await initGame.mutateAsync({
      players,
      mode,
      teams: prepareTeams(players, mode),
      dealer: dealer || null,
    });

    setGameId(gameInitResponse.id);

    setEmptyRoundScore();

    router.navigate("/game-table");
  }, [dealer, initGame, players, router, setEmptyRoundScore, setGameId, setValidations]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
