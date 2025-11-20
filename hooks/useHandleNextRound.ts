import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import { calculateRoundScore } from '../helpers/gameScoreHelpers';
import { useGameStore } from '../store/game';
import { Player, RoundScore } from '../types/game';

const defaultRoundScoreState: RoundScore = {
  id: 0,
  playersScores: [],
  teamsScores: [],
  totalRoundScore: DEFAULT_ROUND_POINTS,
};

export const useHandleNextRound = () => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);
  const [roundScore, setRoundScore] = useState<RoundScore>(
    defaultRoundScoreState
  );

  const roundsScores = useGameStore((state) => state.roundsScores);
  const setStateRoundPlayer = useGameStore((state) => state.setRoundPlayer);
  const updateRoundScore = useGameStore((state) => state.updateRoundScore);

  const handleCancel = useCallback(() => {
    setRoundScore(defaultRoundScoreState);
    setRoundPlayer(null);
    setStateRoundPlayer(null);
  }, [setStateRoundPlayer]);

  const handleNextRound = useCallback(() => {
    setStateRoundPlayer(roundPlayer);
    updateRoundScore(calculateRoundScore(roundScore, roundPlayer));

    setRoundPlayer(null);
    setRoundScore(defaultRoundScoreState);
    setStateRoundPlayer(null);
  }, [roundPlayer, roundScore, setStateRoundPlayer, updateRoundScore]);

  useEffect(() => {
    const lastRoundScores = roundsScores.at(-1);
    if (lastRoundScores) {
      setRoundScore(lastRoundScores);
    }
  }, [roundsScores]);

  return {
    handleNextRound,
    handleCancel,
    roundPlayer,
    setRoundPlayer,
    roundScore,
    setRoundScore,
  };
};
