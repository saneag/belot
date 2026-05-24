import { BOLT_COUNT_LIMIT, BOLT_POINTS } from "@belot/constants";
import type { BaseScore } from "@belot/types";

export const getScore = (score: BaseScore) => {
  if (score.score === BOLT_POINTS) return `BT-${score.boltCount}`;
  return score.totalScore;
};

export const getCurrentScore = (score: BaseScore) => {
  if (score.score === BOLT_POINTS) return score.boltCount === BOLT_COUNT_LIMIT ? "-10" : "";
  if (score.score > 0) return `+${score.score}`;
  return score.score;
};

export const getCurrentScoreColor = (score: BaseScore, isMobile = false) => {
  const currentScore = getCurrentScore(score);

  if (Number(currentScore) === -10 || currentScore.toString().includes("BT-")) {
    return isMobile ? "text-error-500" : "text-destructive";
  }

  return currentScore.toString().startsWith("+")
    ? isMobile
      ? "text-success-500"
      : "text-success"
    : "";
};
