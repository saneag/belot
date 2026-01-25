import { BOLT_COUNT_LIMIT, BOLT_POINTS } from '../../constants';
import { Player, TeamScore } from '../../types';
import { roundByLastDigit } from '../commonUtils';

export const calculateTeamsScore = (
  teamsScores: TeamScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
): TeamScore[] => {
  return teamsScores.map((teamScore) => {
    const { score, boltCount, totalScore, teamId } = teamScore;
    const halfScore = totalRoundScore / 2;

    const isScoreLowerThanHalfOfTotalScore = score < halfScore;
    const isEqualScore = score === halfScore;
    const isOwnTeam = roundPlayer?.teamId === teamId;

    if (isOwnTeam && isScoreLowerThanHalfOfTotalScore && !isEqualScore) {
      if (boltCount === BOLT_COUNT_LIMIT) {
        return {
          ...teamScore,
          score: BOLT_POINTS,
          boltCount: 1,
          totalScore,
        };
      }

      return {
        ...teamScore,
        score: BOLT_POINTS,
        boltCount: boltCount + 1,
        totalScore:
          boltCount + 1 === BOLT_COUNT_LIMIT ? totalScore - 10 : totalScore,
      };
    }

    if (!isOwnTeam && !isScoreLowerThanHalfOfTotalScore && !isEqualScore) {
      return {
        ...teamScore,
        score: roundByLastDigit(totalRoundScore),
        totalScore: totalScore + roundByLastDigit(totalRoundScore),
      };
    }

    if (score === 0) {
      return {
        ...teamScore,
        score: -10,
        totalScore: totalScore - 10,
      };
    }

    return {
      ...teamScore,
      score: roundByLastDigit(score),
      totalScore: totalScore + roundByLastDigit(score),
    };
  });
};
