import {
  CalculateRoundScoreProps,
  GameMode,
  PlayerScore,
  RoundScore,
  TeamScore,
} from '../../types/game';
import { sumOpponentPlayersScores } from './scoreCalculationHelpers';

const handlePlayersScoreChange = ({
  newScoreValue,
  prevRoundScore,
  opponent,
  roundPlayer,
}: Omit<CalculateRoundScoreProps<PlayerScore>, 'gameMode'>): RoundScore => {
  const { playersScores } = prevRoundScore;

  const roundPlayerScore = sumOpponentPlayersScores(
    prevRoundScore,
    roundPlayer
  );

  const getScore = (playerScore: PlayerScore) => {
    if (playerScore.playerId === opponent.playerId) {
      return newScoreValue;
    }

    if (playerScore.playerId === roundPlayer?.id) {
      return roundPlayerScore;
    }

    return playerScore.score;
  };

  return {
    ...prevRoundScore,
    playersScores: playersScores.map((playerScore) => ({
      ...playerScore,
      score: getScore(playerScore),
    })),
  };
};

const handleTeamsScoreChange = ({
  newScoreValue,
  prevRoundScore,
  opponent,
}: Omit<CalculateRoundScoreProps<TeamScore>, 'gameMode'>): RoundScore => {
  const { totalRoundScore, teamsScores } = prevRoundScore;

  const scoreDifference = totalRoundScore - newScoreValue;

  return {
    ...prevRoundScore,
    teamsScores: teamsScores.map((teamScore) => ({
      ...teamScore,
      score:
        teamScore.teamId === opponent.teamId ? newScoreValue : scoreDifference,
    })),
  };
};

export const handleRoundScoreChange = <T extends PlayerScore | TeamScore>({
  gameMode,
  newScoreValue,
  prevRoundScore,
  opponent,
  roundPlayer,
}: CalculateRoundScoreProps<T>): RoundScore => {
  let roundScore = { ...prevRoundScore };

  const { totalRoundScore } = roundScore;

  let scoreValue = newScoreValue;

  if (scoreValue < 0) {
    scoreValue = 0;
  }

  if (scoreValue > totalRoundScore) {
    scoreValue = totalRoundScore;
  }

  const maxAllowed = sumOpponentPlayersScores(roundScore, roundPlayer);

  if (scoreValue > maxAllowed) {
    scoreValue = maxAllowed;
  }

  if (gameMode === GameMode.classic) {
    roundScore = handlePlayersScoreChange({
      newScoreValue: scoreValue,
      prevRoundScore,
      opponent: opponent as PlayerScore,
      roundPlayer,
    });
  } else {
    roundScore = handleTeamsScoreChange({
      newScoreValue: scoreValue,
      prevRoundScore,
      opponent: opponent as TeamScore,
    });
  }

  return roundScore;
};
