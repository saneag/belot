import {
  CalculateRoundScoreProps,
  GameMode,
  PlayerScore,
  RoundScore,
  TeamScore,
} from '../../types';
import { sumOpponentPlayersScores } from './playersScoreCalculationHelpers';

const handlePlayersScoreChange = ({
  newScoreValue,
  prevRoundScore,
  opponent,
  roundPlayer,
}: Omit<CalculateRoundScoreProps<PlayerScore>, 'gameMode'>): RoundScore => {
  const { playersScores } = prevRoundScore;

  const opponentsCalculatedRoundScore = {
    ...prevRoundScore,
    playersScores: playersScores.map((playerScore) => ({
      ...playerScore,
      score:
        playerScore.playerId === opponent.playerId
          ? newScoreValue
          : playerScore.score,
    })),
  };

  let roundPlayerScore = sumOpponentPlayersScores({
    roundScore: opponentsCalculatedRoundScore,
    roundPlayer,
  });

  return {
    ...opponentsCalculatedRoundScore,
    playersScores: opponentsCalculatedRoundScore.playersScores.map(
      (playerScore) => ({
        ...playerScore,
        score:
          playerScore.playerId === roundPlayer?.id
            ? roundPlayerScore
            : playerScore.score,
      }),
    ),
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

  const opponentsScores = sumOpponentPlayersScores({
    roundScore,
    roundPlayer,
    currentOpponent: opponent,
  });

  let scoreValue =
    gameMode === GameMode.teams
      ? Math.max(0, Math.min(newScoreValue, totalRoundScore))
      : Math.max(0, Math.min(newScoreValue, opponentsScores));

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
