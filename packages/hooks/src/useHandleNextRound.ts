import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { POINTS_TYPE, StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import type { Player, RoundScore, Team } from "@belot/types";
import {
  calculateRoundScore,
  checkForGameWinner,
  convertRoundScoreForPointsType,
  getDefaultRoundPoints,
  prepareEmptyRoundScoreRow,
  setNextDealer,
} from "@belot/utils";

import { useIsPointsTypeEnabled } from "./usePointsTypeFeature";

interface UseHandleNextRoundProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
  setToLocalStorage: (key: StorageKeys, value: string) => void;
}

const createDefaultRoundScoreState = (pointsType: string): RoundScore => ({
  id: 0,
  playersScores: [],
  teamsScores: [],
  totalRoundScore: getDefaultRoundPoints(pointsType),
  roundPlayer: null,
});

export const useHandleNextRound = ({ setWinner, setToLocalStorage }: UseHandleNextRoundProps) => {
  const isPointsTypeEnabled = useIsPointsTypeEnabled();
  const storePointsType = useGameStore((state) => state.pointsType);
  const pointsType = isPointsTypeEnabled ? storePointsType : POINTS_TYPE[0].id;
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);
  const [roundScore, setRoundScore] = useState<RoundScore>(
    createDefaultRoundScoreState(pointsType),
  );
  const [dialogPointsType, setDialogPointsType] = useState(pointsType);
  const [gameOverflowCount, setGameOverflowCount] = useState(0);

  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const gameMode = useGameStore((state) => state.mode);
  const roundsScores = useGameStore((state) =>
    Array.isArray(state.roundsScores) ? state.roundsScores : [],
  );
  const updateRoundScore = useGameStore((state) => state.updateRoundScore);
  const dealer = useGameStore((state) => state.dealer);

  const handleCancel = useCallback(() => {
    setRoundPlayer(null);
    setDialogPointsType(pointsType);
  }, [pointsType]);

  const handleDialogPointsTypeChange = useCallback(
    (newPointsType: string) => {
      if (!isPointsTypeEnabled) {
        return;
      }

      setRoundScore((prev) => convertRoundScoreForPointsType(prev, dialogPointsType, newPointsType));
      setDialogPointsType(newPointsType);
    },
    [dialogPointsType, isPointsTypeEnabled],
  );

  const activePointsType = isPointsTypeEnabled ? dialogPointsType : pointsType;

  const handleNextRound = useCallback(() => {
    const calculatedRoundScore = calculateRoundScore(
      roundScore,
      roundPlayer,
      gameMode,
      activePointsType,
    );
    updateRoundScore(calculatedRoundScore);

    setRoundPlayer(null);
    setRoundScore(createDefaultRoundScoreState(pointsType));
    setDialogPointsType(pointsType);

    setWinner(
      checkForGameWinner(
        gameMode,
        players,
        teams,
        calculatedRoundScore,
        gameOverflowCount,
        setGameOverflowCount,
      ),
    );

    const { id: roundScoreId, ...restCalculatedRoundScore } = calculatedRoundScore;

    const roundToUpdateIndex = roundsScores.findIndex((rs) => rs.id === roundScoreId);

    if (roundToUpdateIndex === -1) return;

    const updatedRoundsScores = [...roundsScores];

    updatedRoundsScores[roundToUpdateIndex] = {
      ...updatedRoundsScores[roundToUpdateIndex],
      ...restCalculatedRoundScore,
    };

    const newEmptyRow = prepareEmptyRoundScoreRow({
      players,
      teams,
      mode: gameMode,
      pointsType,
      roundsScores: updatedRoundsScores,
    });

    setToLocalStorage(
      StorageKeys.roundsScores,
      JSON.stringify([...updatedRoundsScores, newEmptyRow]),
    );

    const { dealer: nextDealer } = setNextDealer({
      players,
      roundsScores: [...updatedRoundsScores, newEmptyRow],
      dealer,
    });

    setToLocalStorage(StorageKeys.dealer, JSON.stringify(nextDealer));
  }, [
    activePointsType,
    dealer,
    gameMode,
    gameOverflowCount,
    players,
    pointsType,
    roundPlayer,
    roundScore,
    roundsScores,
    setToLocalStorage,
    setWinner,
    teams,
    updateRoundScore,
  ]);

  const handleDialogOpen = useCallback(
    (showDialog: () => void) => {
      setDialogPointsType(pointsType);

      const lastRoundScores = roundsScores.at(-1);
      if (lastRoundScores) {
        setRoundScore(lastRoundScores);
      }

      showDialog();
    },
    [pointsType, roundsScores],
  );

  return {
    handleNextRound,
    handleCancel,
    handleDialogOpen,
    onDialogPointsTypeChange: handleDialogPointsTypeChange,
    roundPlayer,
    setRoundPlayer,
    roundScore,
    setRoundScore,
    dialogPointsType: activePointsType,
    isPointsTypeEnabled,
  };
};
