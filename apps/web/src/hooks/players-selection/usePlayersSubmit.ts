import { useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { useGameInit } from "@belot/api-client";
import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { GameMode } from "@belot/types";
import { isPlayerNameValid, prepareTeams, validatePlayersNames } from "@belot/utils/src";

import { usePlayersSelectionContext } from "@/components/players-selection/playersSelectionContext";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";

import { toast } from "sonner";

export default function usePlayersSubmit() {
  const navigate = useNavigate();
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

    localStorage.setItem(StorageKeys.players, JSON.stringify(players));
    localStorage.setItem(StorageKeys.hasPreviousGame, "true");

    const mode = players.length === 4 ? GameMode.teams : GameMode.classic;

    try {
      const gameInitResponse = await initGame.mutateAsync({
        players,
        mode,
        teams: prepareTeams(players, mode),
        dealer: dealer || null,
      });

      setGameId(gameInitResponse.id);
    } catch (error) {
      toast.error(
        "You're offline. When you're back online, your game will be saved automatically.",
      );
    }

    setEmptyRoundScore();

    navigate("/game-table", { replace: true });
  }, [dealer, initGame, players, setEmptyRoundScore, setGameId, setValidations]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
