import { ROUND_POINTS_INDEX } from '../constants/gameConstants';
import { ValidateEnteredScoreProps } from '../types/game';

export const validateEnteredScore = ({
  score,
  currentRound,
  playersCount,
  setIsEmptyGame,
}: ValidateEnteredScoreProps) => {
  const roundScore = score[currentRound];

  if (!roundScore) {
    return {
      isValid: false,
      isEmptyGame: false,
    };
  }

  const roundPoints = Number(roundScore[ROUND_POINTS_INDEX]);
  const playersPoints = Object.values(roundScore)
    .splice(0, playersCount)
    .map(Number);

  const playersPointsSum = playersPoints.reduce((acc, curr) => acc + curr, 0);

  if (playersPointsSum === 0) {
    setIsEmptyGame(true);
    return {
      isValid: true,
      isEmptyGame: true,
    };
  }

  return {
    isValid: playersPointsSum !== roundPoints,
    isEmptyGame: false,
  };
};
