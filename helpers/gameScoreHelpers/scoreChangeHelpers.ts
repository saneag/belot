import {
  CalculateRoundScoreProps,
  GameMode,
  PlayerScore,
  RoundScore,
  TeamScore,
} from '../../types/game';

const handlePlayersScoreChange = () => {};

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
}: CalculateRoundScoreProps<T>): RoundScore => {
  let roundScore = { ...prevRoundScore };

  let scoreValue = newScoreValue;

  if (scoreValue < 0) {
    scoreValue = 0;
  }
  if (scoreValue > roundScore.totalRoundScore) {
    scoreValue = roundScore.totalRoundScore;
  }

  if (gameMode === GameMode.classic) {
    handlePlayersScoreChange();
  } else {
    roundScore = handleTeamsScoreChange({
      newScoreValue: scoreValue,
      prevRoundScore,
      opponent: opponent as TeamScore,
    });
  }

  return roundScore;
};
