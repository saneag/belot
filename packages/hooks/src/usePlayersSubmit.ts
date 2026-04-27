import { useCallback } from "react";

import { useGameInit } from "@belot/api-client";
import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { type RoundScore } from "@belot/types";
import {
  isPlayerNameValid,
  prepareEmptyRoundScoreRow,
  prepareTeams,
  validatePlayersNames,
} from "@belot/utils";

import { usePlayersSelectionContext } from "./usePlayersSelectionContext";

interface UsePlayersSubmitProps {
  navigateFunction: () => void;
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
  getApiBaseUrl: () => string;
  handleCatchError: (error: unknown) => void;
}

export function usePlayersSubmit({
  navigateFunction,
  setItemsToStorage,
  getApiBaseUrl,
  handleCatchError,
}: UsePlayersSubmitProps) {
  const { setValidations } = usePlayersSelectionContext();

  const initGame = useGameInit(getApiBaseUrl());

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const mode = useGameStore((state) => state.mode);
  const setEmptyRoundScore = useGameStore((state) => state.setEmptyRoundScore);
  const setGameId = useGameStore((state) => state.setGameId);

  const handleOpenDialog = useCallback(
    (showDialog: () => void) => {
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

    setEmptyRoundScore();

    const emptyRoundScore: RoundScore = prepareEmptyRoundScoreRow({
      dealer,
      mode,
      players,
    });

    await setItemsToStorage({
      [StorageKeys.timerStartTime]: "",
      [StorageKeys.roundsScores]: JSON.stringify([emptyRoundScore]),
      [StorageKeys.players]: JSON.stringify(players),
      [StorageKeys.dealer]: JSON.stringify(dealer),
    });

    navigateFunction();

    initGame.mutate(
      {
        players,
        mode,
        teams: prepareTeams(players, mode),
        dealer: dealer || null,
      },
      {
        onSuccess: (gameInitResponse) => {
          setGameId(gameInitResponse.id);
        },
        onError: (error) => {
          handleCatchError(error);
        },
      },
    );
  }, [
    dealer,
    handleCatchError,
    initGame,
    mode,
    navigateFunction,
    players,
    setEmptyRoundScore,
    setGameId,
    setItemsToStorage,
    setValidations,
  ]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
