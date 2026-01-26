import { BOLT_COUNT_LIMIT, BOLT_POINTS } from '../../constants';
import {
  Player,
  PlayerScore,
  SumOpponentPlayersScoresProps,
} from '../../types';
import { roundByLastDigit } from '../commonUtils';

export const calculatePlayersScoresHelper = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
  shouldRoundScore?: boolean,
): PlayerScore[] => {
  const playerWithHighestScore = getPlayerWithHighestScore(
    playersScores,
    roundPlayer,
    shouldRoundScore,
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
      const finalScore = !shouldRoundScore
        ? roundByLastDigit(roundedScore + roundPlayerScore)
        : roundedScore + roundPlayerScore;

      return {
        ...playerScore,
        score: finalScore,
        totalScore: totalScore + finalScore,
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

export const calculatePlayersScores = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
): PlayerScore[] => {
  const calculatedRoundedPlayersScores = calculatePlayersScoresHelper(
    playersScores,
    roundPlayer,
    totalRoundScore,
    true,
  );

  const scores = calculatedRoundedPlayersScores.map(
    (playerScore) => playerScore.score,
  );
  const hasAtLeastTwoEqualScores =
    new Set(scores).size !== playersScores.length;

  if (hasAtLeastTwoEqualScores) {
    return calculatePlayersScoresHelper(
      playersScores,
      roundPlayer,
      totalRoundScore,
    );
  }

  return calculatedRoundedPlayersScores;
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

const getPlayerWithHighestScore = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  shouldRoundScore?: boolean,
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
