import { BOLT_COUNT_LIMIT, BOLT_POINTS, POINTS_TYPE } from "@belot/constants";
import type { Player, TeamScore } from "@belot/types";

import {
  getBoltTotalPenalty,
  getZeroScorePenalty,
  roundScoreValue,
} from "../pointsTypeHelpers";

export const calculateTeamsScore = (
  teamsScores: TeamScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
  pointsType: string = POINTS_TYPE[0].id,
): TeamScore[] => {
  const zeroScorePenalty = getZeroScorePenalty(pointsType);
  const boltTotalPenalty = getBoltTotalPenalty(pointsType);

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
        totalScore: boltCount + 1 === BOLT_COUNT_LIMIT ? totalScore + boltTotalPenalty : totalScore,
      };
    }

    if (!isOwnTeam && !isScoreLowerThanHalfOfTotalScore && !isEqualScore) {
      const finalScore = roundScoreValue(totalRoundScore, pointsType);

      return {
        ...teamScore,
        score: finalScore,
        totalScore: totalScore + finalScore,
      };
    }

    if (score === 0) {
      return {
        ...teamScore,
        score: zeroScorePenalty,
        totalScore: totalScore + zeroScorePenalty,
      };
    }

    const finalScore = roundScoreValue(score, pointsType);

    return {
      ...teamScore,
      score: finalScore,
      totalScore: totalScore + finalScore,
    };
  });
};
