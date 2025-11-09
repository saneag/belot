import { ROUND_POINTS_INDEX } from '../constants/gameConstants';
import { PlayersScore } from '../types/game';

interface ValidateEnteredScoreProps {
  roundScore: PlayersScore;
  playersCount: number;
  isTeamVsTeam: boolean;
}

export const validateEnteredScore = ({
  roundScore,
  playersCount,
  isTeamVsTeam,
}: ValidateEnteredScoreProps) => {
  if (!Object.keys(roundScore)) {
    return {
      isValid: false,
    };
  }

  const finalPlayersCount = isTeamVsTeam ? 2 : playersCount;

  const roundPoints = Number(roundScore[ROUND_POINTS_INDEX]);
  const playersPoints = Object.values(roundScore)
    .splice(0, finalPlayersCount)
    .map(Number);

  const playersPointsSum = playersPoints.reduce((acc, curr) => acc + curr, 0);

  if (playersPointsSum === 0) {
    return {
      isValid: true,
    };
  }

  return {
    isValid: playersPointsSum === roundPoints,
  };
};
