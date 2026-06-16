import {
  DEFAULT_ROUND_POINTS,
  LIMIT_OF_ROUND_POINTS,
  NEXT_WINNING_STEP,
  POINTS_TYPE,
  ROUND_POINTS,
  WIN_POINTS,
} from "@belot/constants";
import type { RoundScore } from "@belot/types";

import { roundByLastDigit, roundToDecimal } from "./commonUtils";

export const isMicropointsMode = (pointsType: string) => pointsType === POINTS_TYPE[0].id;

export const getDefaultRoundPoints = (pointsType: string) =>
  isMicropointsMode(pointsType) ? DEFAULT_ROUND_POINTS : roundToDecimal(DEFAULT_ROUND_POINTS);

export const applyDefaultTotalRoundScore = (roundScore: RoundScore, pointsType: string) => {
  if (roundScore.roundPlayer) {
    return roundScore;
  }

  return {
    ...roundScore,
    totalRoundScore: getDefaultRoundPoints(pointsType),
  };
};

export const getLimitOfRoundPoints = (pointsType: string) =>
  isMicropointsMode(pointsType)
    ? LIMIT_OF_ROUND_POINTS
    : {
        positive: roundToDecimal(LIMIT_OF_ROUND_POINTS.positive),
        negative: roundToDecimal(LIMIT_OF_ROUND_POINTS.negative),
      };

export const getRoundPointsPresets = (pointsType: string) =>
  isMicropointsMode(pointsType) ? ROUND_POINTS : ROUND_POINTS.map(roundToDecimal);

export const formatRoundPointPresetForDisplay = (roundPoint: number, pointsType: string) =>
  isMicropointsMode(pointsType) ? roundToDecimal(roundPoint) : roundPoint;

export const getWinPoints = () => WIN_POINTS;

export const getNextWinningStep = () => NEXT_WINNING_STEP;

export const formatTotalRoundScoreForDisplay = (totalRoundScore: number, pointsType: string) =>
  isMicropointsMode(pointsType) && String(totalRoundScore).length === 3
    ? roundToDecimal(totalRoundScore)
    : totalRoundScore;

export const finalizeTotalRoundScore = (totalRoundScore: number, pointsType: string) =>
  isMicropointsMode(pointsType) ? roundToDecimal(totalRoundScore) : totalRoundScore;

export const normalizeSkippedRoundScore = (totalRoundScore: number, pointsType: string) =>
  isMicropointsMode(pointsType) ? roundByLastDigit(totalRoundScore) : totalRoundScore;

export const getScoreInputMaxLength = (pointsType: string) =>
  isMicropointsMode(pointsType) ? 3 : 2;

export const getZeroScorePenalty = (pointsType: string) =>
  isMicropointsMode(pointsType) ? -10 : -1;

export const getBoltTotalPenalty = (pointsType: string) =>
  isMicropointsMode(pointsType) ? -10 : -1;

export const getBoltLimitDisplayPenalty = (pointsType: string) =>
  isMicropointsMode(pointsType) ? "-10" : "-1";

export const roundScoreValue = (score: number, pointsType: string) =>
  isMicropointsMode(pointsType) ? roundByLastDigit(score) : score;

export const convertScoreValueForPointsType = (
  score: number,
  fromPointsType: string,
  toPointsType: string,
) => {
  if (fromPointsType === toPointsType) {
    return score;
  }

  if (isMicropointsMode(fromPointsType)) {
    return roundToDecimal(score);
  }

  return score * 10;
};

const clampTotalRoundScore = (totalRoundScore: number, pointsType: string) => {
  const limits = getLimitOfRoundPoints(pointsType);

  if (totalRoundScore >= limits.positive) {
    return limits.positive;
  }

  if (totalRoundScore <= limits.negative) {
    return limits.negative;
  }

  return totalRoundScore;
};

export const convertRoundScoreForPointsType = (
  roundScore: RoundScore,
  fromPointsType: string,
  toPointsType: string,
): RoundScore => {
  if (fromPointsType === toPointsType) {
    return roundScore;
  }

  const totalRoundScore = clampTotalRoundScore(
    convertScoreValueForPointsType(roundScore.totalRoundScore, fromPointsType, toPointsType),
    toPointsType,
  );

  return {
    ...roundScore,
    totalRoundScore,
    playersScores: roundScore.playersScores.map((playerScore) => ({
      ...playerScore,
      score: convertScoreValueForPointsType(playerScore.score, fromPointsType, toPointsType),
    })),
    teamsScores: roundScore.teamsScores.map((teamScore) => ({
      ...teamScore,
      score: convertScoreValueForPointsType(teamScore.score, fromPointsType, toPointsType),
    })),
  };
};
