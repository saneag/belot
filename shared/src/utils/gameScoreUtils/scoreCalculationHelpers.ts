import {
  BOLT_COUNT_LIMIT,
  BOLT_POINTS,
  LIMIT_OF_ROUND_POINTS,
} from '../../constants';
import { GameSlice } from '../../store/game.slice';
import { PlayersSlice } from '../../store/players.slice';
import { RoundSlice } from '../../store/rounds.slice';
import {
  GameMode,
  Player,
  PlayerScore,
  RoundScore,
  SumOpponentPlayersScoresProps,
  TeamScore,
} from '../../types';
import {
  removeNthElementFromEnd,
  roundByLastDigit,
  roundToDecimal,
} from '../commonUtils';
import { setNextDealer, setPreviousDealer } from './gameScoreHelpers';
import {
  prepareEmptyRoundScoreRow,
  preparePreviousRoundScoreRow,
} from './prepareStates';

const calculatePlayersScoresHelper = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
  shouldRoundScore?: boolean
): PlayerScore[] => {
  const playerWithHighestScore = getPlayerWithHighestScore(
    playersScores,
    roundPlayer,
    shouldRoundScore
  );
  const roundPlayerScore = sumOpponentPlayersScores({
    roundScore: { playersScores, totalRoundScore },
    roundPlayer,
    shouldRoundScore,
  });

  return playersScores.map((playerScore) => {
    const { score, boltCount, totalScore, playerId } = playerScore;
    const roundedScore = shouldRoundScore ? roundByLastDigit(score) : score;

    if (roundPlayer?.id === playerId) {
      if (
        playerWithHighestScore &&
        roundPlayerScore < playerWithHighestScore.score
      ) {
        if (boltCount === BOLT_COUNT_LIMIT) {
          return {
            ...playerScore,
            score: BOLT_POINTS,
            boltCount: 1,
            totalScore,
          };
        }

        return {
          ...playerScore,
          score: BOLT_POINTS,
          boltCount: boltCount + 1,
          totalScore:
            boltCount + 1 === BOLT_COUNT_LIMIT ? totalScore - 10 : totalScore,
        };
      } else {
        return {
          ...playerScore,
          score: shouldRoundScore
            ? roundPlayerScore
            : roundByLastDigit(roundPlayerScore),
          totalScore:
            totalScore +
            (shouldRoundScore
              ? roundPlayerScore
              : roundByLastDigit(roundPlayerScore)),
        };
      }
    }

    if (
      playerWithHighestScore?.playerId === playerId &&
      roundPlayerScore < playerWithHighestScore.score
    ) {
      return {
        ...playerScore,
        score: roundedScore + roundPlayerScore,
        totalScore: totalScore + roundedScore + roundPlayerScore,
      };
    }

    if (roundedScore === 0) {
      return {
        ...playerScore,
        score: -10,
        totalScore: totalScore - 10,
        boltCount: playerId === roundPlayer?.id ? boltCount + 1 : boltCount,
      };
    }

    return {
      ...playerScore,
      score: roundByLastDigit(score),
      totalScore: totalScore + roundByLastDigit(score),
    };
  });
};

const calculatePlayersScores = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number
): PlayerScore[] => {
  const calculatedRoundedPlayersScores = calculatePlayersScoresHelper(
    playersScores,
    roundPlayer,
    totalRoundScore,
    true
  );

  const scores = calculatedRoundedPlayersScores.map(
    (playerScore) => playerScore.score
  );
  const hasAtLeastTwoEqualScores =
    new Set(scores).size !== playersScores.length;

  if (hasAtLeastTwoEqualScores) {
    return calculatePlayersScoresHelper(
      playersScores,
      roundPlayer,
      totalRoundScore
    );
  }

  return calculatedRoundedPlayersScores;
};

const calculateTeamsScore = (
  teamsScores: TeamScore[],
  roundPlayer: Player | null,
  totalRoundScore: number
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

export const calculateRoundScore = (
  roundScore: RoundScore,
  roundPlayer: Player | null,
  gameMode: GameMode
) => {
  return {
    ...roundScore,
    playersScores:
      gameMode === GameMode.classic
        ? calculatePlayersScores(
            roundScore.playersScores,
            roundPlayer,
            roundScore.totalRoundScore
          )
        : [],
    teamsScores:
      gameMode === GameMode.teams
        ? calculateTeamsScore(
            roundScore.teamsScores,
            roundPlayer,
            roundScore.totalRoundScore
          )
        : [],
    totalRoundScore: roundToDecimal(roundScore.totalRoundScore),
  };
};

export const calculateTotalRoundScore = (
  operationSign: string,
  roundPoint: number,
  prev: RoundScore
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

export const sumOpponentPlayersScores = ({
  roundScore,
  currentOpponent,
  roundPlayer,
  shouldRoundScore,
}: SumOpponentPlayersScoresProps) => {
  const { playersScores, totalRoundScore } = roundScore;

  const sumScores = playersScores.reduce((acc, playerScore) => {
    if (playerScore.playerId === roundPlayer?.id) {
      return acc;
    }

    if (playerScore.id === currentOpponent?.id) {
      return acc;
    }

    return (
      acc +
      (shouldRoundScore
        ? roundByLastDigit(playerScore.score)
        : playerScore.score)
    );
  }, 0);

  if (totalRoundScore && shouldRoundScore) {
    return roundByLastDigit(totalRoundScore) - sumScores;
  }

  if (totalRoundScore) {
    return totalRoundScore - sumScores;
  }

  return sumScores;
};

export const getPlayerWithHighestScore = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  shouldRoundScore?: boolean
): PlayerScore | undefined => {
  const playerWithHighestScore = playersScores
    .filter((playerScore) => playerScore.playerId !== roundPlayer?.id)
    .sort((a, b) => b.score - a.score)
    .at(0);

  if (playerWithHighestScore && shouldRoundScore) {
    return {
      ...playerWithHighestScore,
      score: roundByLastDigit(playerWithHighestScore.score),
    };
  }

  return playerWithHighestScore;
};

export const recalculateScoreOnUndo = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
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
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
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
