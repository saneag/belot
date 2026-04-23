import { useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { useGameInit } from "@belot/api-client";
import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { GameMode, type RoundScore } from "@belot/types";
import {
  isPlayerNameValid,
  prepareEmptyRoundScoreRow,
  prepareTeams,
  validatePlayersNames,
} from "@belot/utils/src";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { usePlayersSelectionContext } from "@/hooks/players-selection/usePlayersSelectionContext";
import { useLocalizations } from "@/localizations/useLocalization";

import { toast } from "sonner";

export default function usePlayersSubmit() {
  const navigate = useNavigate();

  const messages = useLocalizations([
    {
      key: "server.offline",
    },
  ]);

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

    const mode = players.length === 4 ? GameMode.teams : GameMode.classic;

    localStorage.removeItem(StorageKeys.timerStartTime);
    localStorage.removeItem(StorageKeys.roundsScores);

    localStorage.setItem(StorageKeys.players, JSON.stringify(players));
    localStorage.setItem(StorageKeys.hasPreviousGame, "true");
    localStorage.setItem(StorageKeys.dealer, JSON.stringify(dealer));

    try {
      const gameInitResponse = await initGame.mutateAsync({
        players,
        mode,
        teams: prepareTeams(players, mode),
        dealer: dealer || null,
      });

      setGameId(gameInitResponse.id);
    } catch (error) {
      toast.error(messages.serverOffline, {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }

    setEmptyRoundScore();

    const emptyRoundScore: RoundScore = prepareEmptyRoundScoreRow({
      dealer,
      mode,
      players,
    });
    localStorage.setItem(StorageKeys.roundsScores, JSON.stringify([emptyRoundScore]));

    void navigate("/game-table", { replace: true });
  }, [
    dealer,
    initGame,
    messages,
    navigate,
    players,
    setEmptyRoundScore,
    setGameId,
    setValidations,
  ]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
