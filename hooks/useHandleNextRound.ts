import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import { roundToDecimal } from '../helpers/gameScoreHelpers';
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

  const handleCancel = useCallback(() => {}, []);

  const handleNextRound = useCallback(() => {
    setStateRoundPlayer(roundPlayer);
    setRoundPlayer(null);

    updateRoundScore({
      ...roundScore,
      playersScores: roundScore.playersScores.map((playerScore) => ({
        ...playerScore,
        score: roundToDecimal(playerScore.score),
      })),
      teamsScores: roundScore.teamsScores.map((teamScore) => {
        const lastDigit = teamScore.score % 10;

        return {
          ...teamScore,
          score:
            lastDigit <= 5
              ? Math.floor(teamScore.score / 10)
              : Math.ceil(teamScore.score / 10),
        };
      }),
      totalRoundScore: roundToDecimal(roundScore.totalRoundScore),
    });
    setRoundScore(defaultRoundScoreState);
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
