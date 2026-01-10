import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  useGameStore,
  calculateRoundScore,
  checkForGameWinner,
  Player,
  RoundScore,
  Team,
} from '@belot/shared';
import { defaultRoundScore } from '../constants/defaultRoundScore';

interface UseHandleNextRoundProps {
  score: RoundScore;
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export const useHandleCalculateRound = ({
  score,
  setWinner,
}: UseHandleNextRoundProps) => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>();
  const [roundScore, setRoundScore] = useState<RoundScore>(defaultRoundScore);
  const [gameOverflowCount, setGameOverflowCount] = useState(0);

  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const gameMode = useGameStore((state) => state.mode);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const setStateRoundPlayer = useGameStore((state) => state.setRoundPlayer);
  const addRoundScore = useGameStore((state) => state.addRoundScore);

  const handleCancel = useCallback(() => {
    setRoundPlayer(null);
    setStateRoundPlayer(null);
  }, [setStateRoundPlayer]);

  const handleRoundCalculation = useCallback(() => {
    setStateRoundPlayer(roundPlayer);
    const calculatedRoundScore = calculateRoundScore(
      roundScore,
      roundPlayer,
      gameMode
    );
    addRoundScore(calculatedRoundScore);

    setRoundPlayer(null);
    setRoundScore(defaultRoundScore);
    setStateRoundPlayer(null);

    setWinner(
      checkForGameWinner(
        gameMode,
        players,
        teams,
        calculatedRoundScore,
        gameOverflowCount,
        setGameOverflowCount
      )
    );
  }, [
    gameMode,
    gameOverflowCount,
    players,
    roundPlayer,
    roundScore,
    setStateRoundPlayer,
    setWinner,
    teams,
    addRoundScore,
  ]);

  const handleDialogOpen = useCallback(
    (showDialog: VoidFunction) => {
      const lastRoundScores = roundsScores.at(-1);
      if (lastRoundScores) {
        setRoundScore(lastRoundScores);
      }
      showDialog();
    },
    [roundsScores]
  );

  return {
    handleRoundCalculation,
    handleCancel,
    handleDialogOpen,
    roundPlayer,
    setRoundPlayer,
    roundScore,
    setRoundScore,
  };
};
