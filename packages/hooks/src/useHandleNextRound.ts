import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { DEFAULT_ROUND_POINTS, StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import type { Player, RoundScore, Team } from "@belot/types";
import {
  calculateRoundScore,
  checkForGameWinner,
  prepareEmptyRoundScoreRow,
  setNextDealer,
} from "@belot/utils";

interface UseHandleNextRoundProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
  setToLocalStorage: (key: StorageKeys, value: string) => void;
}

const defaultRoundScoreState: RoundScore = {
  id: 0,
  playersScores: [],
  teamsScores: [],
  totalRoundScore: DEFAULT_ROUND_POINTS,
  roundPlayer: null,
};

export const useHandleNextRound = ({ setWinner, setToLocalStorage }: UseHandleNextRoundProps) => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);
  const [roundScore, setRoundScore] = useState<RoundScore>(defaultRoundScoreState);
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
  }, []);

  const handleNextRound = useCallback(() => {
    const calculatedRoundScore = calculateRoundScore(roundScore, roundPlayer, gameMode);
    updateRoundScore(calculatedRoundScore);

    setRoundPlayer(null);
    setRoundScore(defaultRoundScoreState);

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
    dealer,
    gameMode,
    gameOverflowCount,
    players,
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
      const lastRoundScores = roundsScores.at(-1);
      if (lastRoundScores) {
        setRoundScore(lastRoundScores);
      }
      showDialog();
    },
    [roundsScores],
  );

  return {
    handleNextRound,
    handleCancel,
    handleDialogOpen,
    roundPlayer,
    setRoundPlayer,
    roundScore,
    setRoundScore,
  };
};
