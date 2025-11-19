import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import { useGameStore } from '../store/game';
import { Player, RoundScore } from '../types/game';

export const useHandleNextRound = () => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);
  const [roundScore, setRoundScore] = useState<RoundScore>({
    id: 0,
    playersScores: [],
    teamsScores: [],
    totalRoundScore: DEFAULT_ROUND_POINTS,
  });

  const roundsScores = useGameStore((state) => state.roundsScores);
  const setStateRoundPlayer = useGameStore((state) => state.setRoundPlayer);
  const updateRoundScore = useGameStore((state) => state.updateRoundScore);

  const handleCancel = useCallback(() => {}, []);

  const handleNextRound = useCallback(() => {
    setStateRoundPlayer(roundPlayer);
    updateRoundScore(roundScore);
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
