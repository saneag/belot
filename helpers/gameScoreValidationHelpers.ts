import { ROUND_POINTS_INDEX } from '../constants/gameConstants';
import { ValidateEnteredScoreProps } from '../types/game';

export const validateEnteredScore = ({
  roundScore,
  playersCount,
  setIsEmptyGame,
  isTeamVsTeam,
}: ValidateEnteredScoreProps) => {
  if (!Object.keys(roundScore)) {
    return {
      isValid: false,
      isEmptyGame: false,
    };
  }

  const finalPlayersCount = isTeamVsTeam ? 2 : playersCount;

  const roundPoints = Number(roundScore[ROUND_POINTS_INDEX]);
  const playersPoints = Object.values(roundScore)
    .splice(0, finalPlayersCount)
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
    isValid: playersPointsSum === roundPoints,
    isEmptyGame: false,
  };
};
