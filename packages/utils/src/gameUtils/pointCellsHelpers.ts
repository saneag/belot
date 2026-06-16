import { BOLT_COUNT_LIMIT, BOLT_POINTS, POINTS_TYPE } from "@belot/constants";
import type { BaseScore } from "@belot/types";

import { getBoltLimitDisplayPenalty } from "../pointsTypeHelpers";

export const getScore = (score: BaseScore) => {
  if (score.score === BOLT_POINTS) return `BT-${score.boltCount}`;
  return score.totalScore;
};

export const getCurrentScore = (score: BaseScore, pointsType: string = POINTS_TYPE[0].id) => {
  const boltLimitDisplayPenalty = getBoltLimitDisplayPenalty(pointsType);

  if (score.score === BOLT_POINTS) {
    return score.boltCount === BOLT_COUNT_LIMIT ? boltLimitDisplayPenalty : "";
  }
  if (score.score > 0) return `+${score.score}`;
  return score.score;
};

export const getCurrentScoreColor = (
  score: BaseScore,
  isMobile = false,
  pointsType: string = POINTS_TYPE[0].id,
) => {
  const currentScore = getCurrentScore(score, pointsType);
  const boltLimitDisplayPenalty = getBoltLimitDisplayPenalty(pointsType);

  if (
    Number(currentScore) === Number(boltLimitDisplayPenalty) ||
    currentScore.toString().includes("BT-")
  ) {
    return isMobile ? "text-error-500" : "text-destructive";
  }

  return currentScore.toString().startsWith("+")
    ? isMobile
      ? "text-success-500"
      : "text-success"
    : "";
};
