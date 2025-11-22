import {
  BOLT_COUNT_LIMIT,
  BOLT_POINTS,
  LIMIT_OF_ROUND_POINTS,
} from '../../constants/gameConstants';
import { Player, PlayerScore, RoundScore, TeamScore } from '../../types/game';
import { roundByLastDigit, roundToDecimal } from '../commonHelpers';

const calculatePlayersScore = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number
): PlayerScore[] => {
  return playersScores.map((playerScore) => ({
    ...playerScore,
    score: roundToDecimal(playerScore.score),
  }));
};

const calculateTeamsScore = (
  teamsScores: TeamScore[],
  roundPlayer: Player | null,
  totalRoundScore: number
): TeamScore[] => {
  return teamsScores.map((teamScore) => {
    const { score, boltCount, totalScore } = teamScore;
    const halfScore = totalRoundScore / 2;

    const isScoreLowerThanHalfOfTotalScore = teamScore.score < halfScore;
    const isEqualScore = teamScore.score === halfScore;
    const isOwnTeam = roundPlayer?.teamId === teamScore.teamId;

    if (score === 0) {
      return {
        ...teamScore,
        score: -10,
        totalScore: totalScore - 10,
      };
    }

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

    return {
      ...teamScore,
      score: roundByLastDigit(score),
      totalScore: totalScore + roundByLastDigit(score),
    };
  });
};

export const calculateRoundScore = (
  roundScore: RoundScore,
  roundPlayer: Player | null
) => {
  return {
    ...roundScore,
    playersScores: calculatePlayersScore(
      roundScore.playersScores,
      roundPlayer,
      roundScore.totalRoundScore
    ),
    teamsScores: calculateTeamsScore(
      roundScore.teamsScores,
      roundPlayer,
      roundScore.totalRoundScore
    ),
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
