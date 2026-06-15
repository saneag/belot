import { POINTS_TYPE } from "@belot/constants";
import {
  GameMode,
  type GameSlice,
  type Player,
  type PlayersSlice,
  type RoundScore,
  type RoundSlice,
} from "@belot/types";

import { removeNthElementFromEnd } from "../commonUtils";
import {
  finalizeTotalRoundScore,
  getLimitOfRoundPoints,
} from "../pointsTypeHelpers";
import { setNextDealer, setPreviousDealer } from "./gameScoreHelpers";
import { calculatePlayersScores } from "./playersScoreCalculationHelpers";
import { prepareEmptyRoundScoreRow, preparePreviousRoundScoreRow } from "./prepareStates";
import { calculateTeamsScore } from "./teamsScoreCalculationHelpers";

export const calculateRoundScore = (
  roundScore: RoundScore,
  roundPlayer: Player | null,
  gameMode: GameMode,
  pointsType: string = POINTS_TYPE[0].id,
) => {
  return {
    ...roundScore,
    roundPlayer,
    playersScores:
      gameMode === GameMode.classic
        ? calculatePlayersScores(
            roundScore.playersScores,
            roundPlayer,
            roundScore.totalRoundScore,
            pointsType,
          )
        : [],
    teamsScores:
      gameMode === GameMode.teams
        ? calculateTeamsScore(
            roundScore.teamsScores,
            roundPlayer,
            roundScore.totalRoundScore,
            pointsType,
          )
        : [],
    totalRoundScore: finalizeTotalRoundScore(roundScore.totalRoundScore, pointsType),
  };
};

export const calculateTotalRoundScore = (
  operationSign: string,
  roundPoint: number,
  prev: RoundScore,
  pointsType: string = POINTS_TYPE[0].id,
): RoundScore => {
  let totalRoundScore = prev.totalRoundScore;
  const limits = getLimitOfRoundPoints(pointsType);

  if (operationSign === "+") {
    totalRoundScore += roundPoint;
  } else {
    totalRoundScore -= roundPoint;
  }

  if (totalRoundScore >= limits.positive) {
    totalRoundScore = limits.positive;
  }

  if (totalRoundScore <= limits.negative) {
    totalRoundScore = limits.negative;
  }

  return {
    ...prev,
    totalRoundScore,
  };
};

export const recalculateScoreOnUndo = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>,
): Pick<RoundSlice, "roundsScores" | "undoneRoundsScores"> => {
  const { roundsScores, undoneRoundsScores, pointsType = POINTS_TYPE[0].id } = state;

  const undoneRoundScore = roundsScores.at(-2);
  let previousRoundScore = roundsScores.at(-3);

  if (!undoneRoundScore) {
    return {
      roundsScores,
      undoneRoundsScores,
    };
  }

  const adjustedRoundsScores = roundsScores.slice(0, roundsScores.length - 2);

  if (!previousRoundScore) {
    previousRoundScore = prepareEmptyRoundScoreRow({
      ...state,
      roundsScores: adjustedRoundsScores,
    });
  }

  return {
    roundsScores: [
      ...adjustedRoundsScores,
      preparePreviousRoundScoreRow(previousRoundScore, undoneRoundScore, pointsType),
    ],
    undoneRoundsScores: [...undoneRoundsScores, undoneRoundScore],
    ...setPreviousDealer(state),
  };
};

export const recalculateScoreOnRedo = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>,
): Pick<RoundSlice, "roundsScores" | "undoneRoundsScores"> => {
  const { roundsScores, undoneRoundsScores } = state;

  const undoneRoundScore = undoneRoundsScores.at(-1);

  if (!undoneRoundScore) {
    return {
      roundsScores,
      undoneRoundsScores,
    };
  }

  const adjustedRoundsScores = [...removeNthElementFromEnd(roundsScores, 1), undoneRoundScore];

  return {
    roundsScores: [
      ...adjustedRoundsScores,
      prepareEmptyRoundScoreRow({
        ...state,
        roundsScores: adjustedRoundsScores,
      }),
    ],
    undoneRoundsScores: removeNthElementFromEnd(undoneRoundsScores, 1),
    ...setNextDealer(state),
  };
};
