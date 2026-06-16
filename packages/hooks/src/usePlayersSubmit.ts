import { useCallback } from "react";

import { useGameInit } from "@belot/api-client";
import { POINTS_TYPE, StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { type RoundScore } from "@belot/types";
import {
  isPlayerNameValid,
  prepareEmptyRoundScoreRow,
  prepareTeams,
  validatePlayersNames,
} from "@belot/utils";

import { usePlayersSelectionContext } from "./usePlayersSelectionContext";
import { useFeatureToggle } from "./featureToggles/useFeatureToggle";
import { useIsPointsTypeEnabled } from "./usePointsTypeFeature";

interface UsePlayersSubmitProps {
  navigateFunction: () => void;
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
  getApiBaseUrl: () => string;
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  handleCatchError: (error: unknown) => void;
}

export function usePlayersSubmit({
  navigateFunction,
  setItemsToStorage,
  getApiBaseUrl,
  getFromStorage,
  handleCatchError,
}: UsePlayersSubmitProps) {
  const { setValidations } = usePlayersSelectionContext();

  const initGame = useGameInit(getApiBaseUrl());

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const mode = useGameStore((state) => state.mode);
  const setRoundsScores = useGameStore((state) => state.setRoundsScores);
  const setGameId = useGameStore((state) => state.setGameId);
  const setPointsType = useGameStore((state) => state.setPointsType);
  const isBackendGameInitEnabled = useFeatureToggle("backend-game-init");
  const isPointsTypeEnabled = useIsPointsTypeEnabled();

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

    const storageSettings = await getFromStorage(StorageKeys.settings);
    const storedPointsType = storageSettings
      ? (JSON.parse(storageSettings) as { pointsType: string }).pointsType
      : undefined;
    const pointsType = isPointsTypeEnabled
      ? storedPointsType ?? POINTS_TYPE[0].id
      : POINTS_TYPE[0].id;

    setPointsType(pointsType);

    const emptyRoundScore: RoundScore = prepareEmptyRoundScoreRow({
      dealer,
      mode,
      players,
      teams: prepareTeams(players, mode),
      pointsType,
      roundsScores: [],
    });

    setRoundsScores([emptyRoundScore]);

    await setItemsToStorage({
      [StorageKeys.timerStartTime]: "",
      [StorageKeys.roundsScores]: JSON.stringify([emptyRoundScore]),
      [StorageKeys.players]: JSON.stringify(players),
      [StorageKeys.dealer]: JSON.stringify(dealer),
    });

    navigateFunction();

    if (!isBackendGameInitEnabled) {
      return;
    }

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
    getFromStorage,
    handleCatchError,
    initGame,
    isBackendGameInitEnabled,
    isPointsTypeEnabled,
    mode,
    navigateFunction,
    players,
    setRoundsScores,
    setGameId,
    setItemsToStorage,
    setPointsType,
    setValidations,
  ]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
