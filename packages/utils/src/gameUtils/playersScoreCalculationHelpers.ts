import { BOLT_COUNT_LIMIT, BOLT_POINTS, POINTS_TYPE } from "@belot/constants";
import type { Player, PlayerScore, SumOpponentPlayersScoresProps } from "@belot/types";

import {
  getBoltTotalPenalty,
  getZeroScorePenalty,
  isMicropointsMode,
  roundScoreValue,
} from "../pointsTypeHelpers";

export const calculatePlayersScoresHelper = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
  shouldRoundScore?: boolean,
  pointsType: string = POINTS_TYPE[0].id,
): PlayerScore[] => {
  const useMicropointRounding = isMicropointsMode(pointsType);
  const zeroScorePenalty = getZeroScorePenalty(pointsType);
  const boltTotalPenalty = getBoltTotalPenalty(pointsType);

  const playerWithHighestScore = getPlayerWithHighestScore(
    playersScores,
    roundPlayer,
    shouldRoundScore,
    pointsType,
  );
  const roundPlayerScore = sumOpponentPlayersScores({
    roundScore: { playersScores, totalRoundScore },
    roundPlayer,
    shouldRoundScore,
    pointsType,
  });
  const shouldApplyBolt =
    !!playerWithHighestScore && roundPlayerScore < playerWithHighestScore.score;
  const opponentsWithComparableScores = playersScores
    .filter((playerScore) => playerScore.playerId !== roundPlayer?.id)
    .map((playerScore) => ({
      playerId: playerScore.playerId,
      score: shouldRoundScore ? roundScoreValue(playerScore.score, pointsType) : playerScore.score,
    }));
  const highestOpponentScore = Math.max(
    ...opponentsWithComparableScores.map((playerScore) => playerScore.score),
  );
  const highestOpponentPlayerIds = opponentsWithComparableScores
    .filter((playerScore) => playerScore.score === highestOpponentScore)
    .map((playerScore) => playerScore.playerId);
  const sharedBoltScore =
    highestOpponentPlayerIds.length > 0
      ? Math.floor(roundPlayerScore / highestOpponentPlayerIds.length)
      : 0;
  const sharedBoltScoreRemainder =
    highestOpponentPlayerIds.length > 0 ? roundPlayerScore % highestOpponentPlayerIds.length : 0;

  return playersScores.map((playerScore) => {
    const { score, boltCount, totalScore, playerId } = playerScore;
    const roundedScore = shouldRoundScore ? roundScoreValue(score, pointsType) : score;

    if (roundPlayer?.id === playerId) {
      if (shouldApplyBolt) {
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
            boltCount + 1 === BOLT_COUNT_LIMIT ? totalScore + boltTotalPenalty : totalScore,
        };
      } else {
        const finalRoundPlayerScore = shouldRoundScore
          ? roundPlayerScore
          : roundScoreValue(roundPlayerScore, pointsType);

        return {
          ...playerScore,
          score: finalRoundPlayerScore,
          totalScore: totalScore + finalRoundPlayerScore,
        };
      }
    }

    if (shouldApplyBolt && highestOpponentPlayerIds.includes(playerId)) {
      const sharedScoreIndex = highestOpponentPlayerIds.indexOf(playerId);
      const sharedBonus = sharedBoltScore + (sharedScoreIndex < sharedBoltScoreRemainder ? 1 : 0);
      const finalScore =
        useMicropointRounding && !shouldRoundScore
          ? roundScoreValue(roundedScore + sharedBonus, pointsType)
          : roundedScore + sharedBonus;

      return {
        ...playerScore,
        score: finalScore,
        totalScore: totalScore + finalScore,
      };
    }

    if (roundedScore === 0) {
      return {
        ...playerScore,
        score: zeroScorePenalty,
        totalScore: totalScore + zeroScorePenalty,
        boltCount,
      };
    }

    const finalScore = roundScoreValue(score, pointsType);

    return {
      ...playerScore,
      score: finalScore,
      totalScore: totalScore + finalScore,
    };
  });
};

export const calculatePlayersScores = (
  playersScores: PlayerScore[],
  roundPlayer: Player | null,
  totalRoundScore: number,
  pointsType: string = POINTS_TYPE[0].id,
): PlayerScore[] => {
  if (!isMicropointsMode(pointsType)) {
    return calculatePlayersScoresHelper(
      playersScores,
      roundPlayer,
      totalRoundScore,
      false,
      pointsType,
    );
  }

  const calculatedRoundedPlayersScores = calculatePlayersScoresHelper(
    playersScores,
    roundPlayer,
    totalRoundScore,
    true,
    pointsType,
  );

  const roundedRoundPlayerScore = calculatedRoundedPlayersScores.find(
    (playerScore) => playerScore.playerId === roundPlayer?.id,
  )?.score;
  const isRoundPlayerTiedOnRoundedScore = calculatedRoundedPlayersScores.some(
    (playerScore) =>
      playerScore.playerId !== roundPlayer?.id && playerScore.score === roundedRoundPlayerScore,
  );

  if (isRoundPlayerTiedOnRoundedScore) {
    return calculatePlayersScoresHelper(
      playersScores,
      roundPlayer,
      totalRoundScore,
      false,
      pointsType,
    );
  }

  return calculatedRoundedPlayersScores;
};

export const sumOpponentPlayersScores = ({
  roundScore,
  currentOpponent,
  roundPlayer,
  shouldRoundScore,
  pointsType = POINTS_TYPE[0].id,
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
      acc + (shouldRoundScore ? roundScoreValue(playerScore.score, pointsType) : playerScore.score)
    );
  }, 0);

  if (totalRoundScore && shouldRoundScore) {
    return roundScoreValue(totalRoundScore, pointsType) - sumScores;
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
  pointsType: string = POINTS_TYPE[0].id,
): PlayerScore | undefined => {
  const playerWithHighestScore = playersScores
    .filter((playerScore) => playerScore.playerId !== roundPlayer?.id)
    .sort((a, b) => b.score - a.score)
    .at(0);

  if (playerWithHighestScore && shouldRoundScore) {
    return {
      ...playerWithHighestScore,
      score: roundScoreValue(playerWithHighestScore.score, pointsType),
    };
  }

  return playerWithHighestScore;
};
