import {
  DEFAULT_ROUND_POINTS,
  ROUND_POINTS_INDEX,
} from '../constants/gameConstants';
import { GameScore, ValidateEnteredScoreProps } from '../types/game';

export const prepareEmptyScoreRow = (
  playersCount: number,
  rowIndex: number
): GameScore => {
  const players = Array.from({ length: playersCount !== 4 ? playersCount : 2 });
  const rawScore = players.reduce((acc: Record<string, string>, _, index) => {
    acc[index.toString()] = '0';
    return acc;
  }, {});

  rawScore[ROUND_POINTS_INDEX] = String(DEFAULT_ROUND_POINTS);

  return {
    [rowIndex.toString()]: rawScore,
  };
};

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
