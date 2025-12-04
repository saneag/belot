import {
  BOLT_COUNT_LIMIT,
  BOLT_POINTS,
  LIMIT_OF_ROUND_POINTS,
  roundByLastDigit,
  roundToDecimal,
} from '@belot/shared';
import {
  Player,
  PlayerScore,
  RoundScore,
  SumOpponentPlayersScoresProps,
  TeamScore,
} from '@/types/game';

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

    if (roundedScore === 0) {
      return {
        ...playerScore,
        score: -10,
        totalScore: totalScore - 10,
      };
    }

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
    playersScores: calculatePlayersScores(
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
