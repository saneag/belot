import { useCallback } from "react";

import { POINTS_TYPE, StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { type RoundScore } from "@belot/types";
import {
  isPlayerNameValid,
  prepareEmptyRoundScoreRow,
  prepareTeams,
  validatePlayersNames,
} from "@belot/utils";

import { useFeatureToggle } from "./featureToggles/useFeatureToggle";
import { usePlayersSelectionContext } from "./usePlayersSelectionContext";
import { useIsPointsTypeEnabled } from "./usePointsTypeFeature";

interface UsePlayersSubmitProps {
  navigateFunction: () => void;
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
  getApiBaseUrl?: () => string;
  getFromStorage: (key: StorageKeys) => Promise<string | null> | string | null;
  handleCatchError?: (error: unknown) => void;
}

export function usePlayersSubmit({
  navigateFunction,
  setItemsToStorage,
  getFromStorage,
}: UsePlayersSubmitProps) {
  const { setValidations } = usePlayersSelectionContext();

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const mode = useGameStore((state) => state.mode);
  const maxScore = useGameStore((state) => state.maxScore);
  const setRoundsScores = useGameStore((state) => state.setRoundsScores);
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
      ? (storedPointsType ?? POINTS_TYPE[0].id)
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

    const gameInitInput = {
      players,
      mode,
      teams: prepareTeams(players, mode),
      dealer: dealer || null,
    };

    await setItemsToStorage({
      [StorageKeys.timerStartTime]: "",
      [StorageKeys.roundsScores]: JSON.stringify([emptyRoundScore]),
      [StorageKeys.players]: JSON.stringify(players),
      [StorageKeys.dealer]: JSON.stringify(dealer),
      [StorageKeys.maxScore]: String(maxScore),
      ...(isBackendGameInitEnabled
        ? { [StorageKeys.pendingGameInit]: JSON.stringify(gameInitInput) }
        : {}),
    });

    navigateFunction();
  }, [
    dealer,
    getFromStorage,
    isBackendGameInitEnabled,
    isPointsTypeEnabled,
    maxScore,
    mode,
    navigateFunction,
    players,
    setRoundsScores,
    setItemsToStorage,
    setPointsType,
    setValidations,
  ]);

  return {
    handleOpenDialog,
    handleSubmit,
  };
}
