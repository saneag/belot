import { LIMIT_OF_ROUND_POINTS } from '../../constants';
import { GameSlice } from '../../store/game.slice';
import { PlayersSlice } from '../../store/players.slice';
import { RoundSlice } from '../../store/rounds.slice';
import { GameMode, Player, RoundScore } from '../../types';
import { removeNthElementFromEnd, roundToDecimal } from '../commonUtils';
import { setNextDealer, setPreviousDealer } from './gameScoreHelpers';
import { calculatePlayersScores } from './playersScoreCalculationHelpers';
import {
  prepareEmptyRoundScoreRow,
  preparePreviousRoundScoreRow,
} from './prepareStates';
import { calculateTeamsScore } from './teamsScoreCalculationHelpers';

export const calculateRoundScore = (
  roundScore: RoundScore,
  roundPlayer: Player | null,
  gameMode: GameMode,
) => {
  return {
    ...roundScore,
    playersScores:
      gameMode === GameMode.classic
        ? calculatePlayersScores(
            roundScore.playersScores,
            roundPlayer,
            roundScore.totalRoundScore,
          )
        : [],
    teamsScores:
      gameMode === GameMode.teams
        ? calculateTeamsScore(
            roundScore.teamsScores,
            roundPlayer,
            roundScore.totalRoundScore,
          )
        : [],
    totalRoundScore: roundToDecimal(roundScore.totalRoundScore),
  };
};

export const calculateTotalRoundScore = (
  operationSign: string,
  roundPoint: number,
  prev: RoundScore,
): RoundScore => {
  let totalRoundScore = prev.totalRoundScore;

  if (operationSign === '+') {
    totalRoundScore += roundPoint;
  } else {
    totalRoundScore -= roundPoint;
  }

  if (totalRoundScore >= LIMIT_OF_ROUND_POINTS.positive) {
    totalRoundScore = LIMIT_OF_ROUND_POINTS.positive;
  }

  if (totalRoundScore <= LIMIT_OF_ROUND_POINTS.negative) {
    totalRoundScore = LIMIT_OF_ROUND_POINTS.negative;
  }

  return {
    ...prev,
    totalRoundScore,
  };
};

export const recalculateScoreOnUndo = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>,
): Pick<RoundSlice, 'roundsScores' | 'undoneRoundsScores'> => {
  const { roundsScores, undoneRoundsScores } = state;

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
      preparePreviousRoundScoreRow(previousRoundScore, undoneRoundScore),
    ],
    undoneRoundsScores: [...undoneRoundsScores, undoneRoundScore],
    ...setPreviousDealer(state),
  };
};

export const recalculateScoreOnRedo = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>,
): Pick<RoundSlice, 'roundsScores' | 'undoneRoundsScores'> => {
  const { roundsScores, undoneRoundsScores } = state;

  const undoneRoundScore = undoneRoundsScores.at(-1);

  if (!undoneRoundScore) {
    return {
      roundsScores,
      undoneRoundsScores,
    };
  }

  const adjustedRoundsScores = [
    ...removeNthElementFromEnd(roundsScores, 1),
    undoneRoundScore,
  ];

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
