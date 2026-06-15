import {
  DEFAULT_ROUND_POINTS,
  LIMIT_OF_ROUND_POINTS,
  NEXT_WINNING_STEP,
  POINTS_TYPE,
  ROUND_POINTS,
  WIN_POINTS,
} from "@belot/constants";

import { roundByLastDigit, roundToDecimal } from "./commonUtils";

export const isMicropointsMode = (pointsType: string) => pointsType === POINTS_TYPE[0].id;

export const getDefaultRoundPoints = (pointsType: string) =>
  isMicropointsMode(pointsType) ? DEFAULT_ROUND_POINTS : roundToDecimal(DEFAULT_ROUND_POINTS);

export const getLimitOfRoundPoints = (pointsType: string) =>
  isMicropointsMode(pointsType)
    ? LIMIT_OF_ROUND_POINTS
    : {
        positive: roundToDecimal(LIMIT_OF_ROUND_POINTS.positive),
        negative: roundToDecimal(LIMIT_OF_ROUND_POINTS.negative),
      };

export const getRoundPointsPresets = (pointsType: string) =>
  isMicropointsMode(pointsType) ? ROUND_POINTS : ROUND_POINTS.map(roundToDecimal);

export const getWinPoints = (pointsType: string) =>
  isMicropointsMode(pointsType) ? WIN_POINTS : roundToDecimal(WIN_POINTS);

export const getNextWinningStep = (pointsType: string) =>
  isMicropointsMode(pointsType) ? NEXT_WINNING_STEP : roundToDecimal(NEXT_WINNING_STEP);

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
