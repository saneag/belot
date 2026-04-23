import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { DEFAULT_ROUND_POINTS, StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { type Player, type RoundScore, type Team } from "@belot/types";
import {
  calculateRoundScore,
  checkForGameWinner,
  prepareEmptyRoundScoreRow,
  setNextDealer,
} from "@belot/utils/src";

const defaultRoundScoreState: RoundScore = {
  id: 0,
  playersScores: [],
  teamsScores: [],
  totalRoundScore: DEFAULT_ROUND_POINTS,
  roundPlayer: null,
};

interface UseHandleNextRoundProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export const useHandleNextRound = ({ setWinner }: UseHandleNextRoundProps) => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);
  const [roundScore, setRoundScore] = useState<RoundScore>(defaultRoundScoreState);
  const [gameOverflowCount, setGameOverflowCount] = useState(0);

  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const gameMode = useGameStore((state) => state.mode);
  const roundsScores = useGameStore((state) => state.roundsScores);
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

    localStorage.setItem(
      StorageKeys.roundsScores,
      JSON.stringify([...updatedRoundsScores, newEmptyRow]),
    );

    const { dealer: nextDealer } = setNextDealer({
      players,
      roundsScores: [...updatedRoundsScores, newEmptyRow],
      dealer,
    });

    localStorage.setItem(StorageKeys.dealer, JSON.stringify(nextDealer));
  }, [
    dealer,
    gameMode,
    gameOverflowCount,
    players,
    roundPlayer,
    roundScore,
    roundsScores,
    setWinner,
    teams,
    updateRoundScore,
  ]);

  const handleDialogOpen = useCallback(
    (showDialog: VoidFunction) => {
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
