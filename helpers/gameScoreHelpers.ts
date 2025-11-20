import {
  BOLT_COUNT_LIMIT,
  BOLT_POINTS,
  DEFAULT_ROUND_POINTS,
  LIMIT_OF_ROUND_POINTS,
} from '../constants/gameConstants';
import { GameSlice } from '../store/game.slice';
import { PlayersSlice } from '../store/players.slice';
import { RoundSlice } from '../store/rounds.slice';
import {
  CalculateRoundScoreProps,
  GameMode,
  Player,
  PlayerScore,
  RoundScore,
  TeamScore,
} from '../types/game';

const preparePlayersScores = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
): PlayerScore[] => {
  const mode = state.mode;
  const lastRoundScore = state.roundsScores.at(-1);
  const players = state.players;

  if (mode === 'teams' || !players) return [];

  if (lastRoundScore === undefined) {
    return players.map((player, index) => ({
      id: index,
      playerId: player.id,
      score: 0,
      boltCount: 0,
      totalScore: 0,
    }));
  }

  const newPlayersScore: PlayerScore[] = lastRoundScore.playersScores.map(
    (playerScore) => ({
      id: playerScore.id,
      playerId: playerScore.playerId,
      score: 0,
      boltCount: playerScore.boltCount,
      totalScore: playerScore.totalScore,
    })
  );

  return newPlayersScore;
};

const prepareTeamsScores = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
): TeamScore[] => {
  const { mode, teams, roundsScores } = state;
  const lastRoundScore = roundsScores.at(-1);

  if (mode === 'classic' || !teams) return [];

  if (lastRoundScore === undefined) {
    return teams.map((team, index) => ({
      id: index,
      teamId: team.id,
      score: 0,
      boltCount: 0,
      totalScore: 0,
    }));
  }

  const newTeamsScore: TeamScore[] = lastRoundScore.teamsScores.map(
    (teamScore) => ({
      id: teamScore.id,
      teamId: teamScore.teamId,
      score: 0,
      boltCount: teamScore.boltCount,
      totalScore: teamScore.totalScore,
    })
  );

  return newTeamsScore;
};

export const prepareEmptyRoundScoreRow = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
): RoundScore => {
  const lastRoundScore = state.roundsScores.at(-1);

  return {
    id: lastRoundScore?.id !== undefined ? lastRoundScore.id + 1 : 0,
    playersScores: preparePlayersScores(state),
    teamsScores: prepareTeamsScores(state),
    totalRoundScore: DEFAULT_ROUND_POINTS,
  };
};

export const setNextDealer = (state: RoundSlice & Partial<PlayersSlice>) => {
  if (state.roundsScores.length === 0) {
    return {};
  }

  const players = state.players;

  if (!players || players.length === 0) {
    return {};
  }

  const currentDealerIndex = players.findIndex(
    (player) => player.id === state.dealer?.id
  );

  const nextDealerIndex =
    currentDealerIndex === -1 ? 0 : (currentDealerIndex + 1) % players.length;

  return {
    dealer: players[nextDealerIndex],
  };
};

export const prepareTeams = (players: Player[], mode: GameMode) => {
  return mode === 'classic'
    ? []
    : [
        {
          id: 0,
          playersIds: [players[0].id, players[2].id],
        },
        {
          id: 1,
          playersIds: [players[1].id, players[3].id],
        },
      ];
};

export const roundToDecimal = (totalRoundScore: number) =>
  Math.floor(totalRoundScore / 10);

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

export const getOpponentPlayersScore = (
  roundPlayer: Player | null,
  playersScores?: PlayerScore[]
) => {
  return playersScores?.filter(
    (playerScore) => playerScore.playerId !== roundPlayer?.id
  );
};

export const getOpponentTeamScore = (
  roundPlayer: Player | null,
  teamsScores?: TeamScore[]
) => {
  return teamsScores?.filter(
    (teamScore) => teamScore.teamId !== roundPlayer?.teamId
  );
};

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

  if (gameMode === 'classic') {
    handlePlayersScoreChange();
  } else {
    roundScore = handleTeamsScoreChange({
      newScoreValue,
      prevRoundScore,
      opponent: opponent as TeamScore,
    });
  }

  return roundScore;
};

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

const roundByLastDigit = (score: number) =>
  score % 10 <= 5 ? Math.floor(score / 10) : Math.ceil(score / 10);

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
