import {
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

  if (mode === 'team' || !players) return [];

  if (lastRoundScore === undefined) {
    return players.map((player, index) => ({
      id: index,
      playerId: player.id,
      score: 0,
    }));
  }

  const newPlayersScore: PlayerScore[] = lastRoundScore.playersScores.map(
    (playerScore) => ({
      id: playerScore.id + 1,
      playerId: playerScore.playerId,
      score: 0,
    })
  );

  return newPlayersScore;
};

const prepareTeamsScores = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
): TeamScore[] => {
  const mode = state.mode;
  const lastRoundScore = state.roundsScores.at(-1);
  const teams = state.teams;

  if (mode === 'classic' || !teams) return [];

  if (lastRoundScore === undefined) {
    return teams.map((team, index) => ({
      id: index,
      teamId: team.id,
      score: 0,
    }));
  }

  const newTeamsScore: TeamScore[] = lastRoundScore.teamsScores.map(
    (teamScore) => ({
      id: teamScore.id + 1,
      teamId: teamScore.teamId,
      score: 0,
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

export const prepareRoundScoresBasedOnGameMode = (
  gameMode: GameMode,
  roundScore: RoundScore,
  opponent: PlayerScore | TeamScore
) => {
  return gameMode === 'classic'
    ? roundScore.playersScores.find(
        (playersScore) => playersScore.id === opponent.id
      )
    : roundScore.teamsScores.find(
        (teamsScore) => teamsScore.id === opponent.id
      );
};

const calculatePlayersScore = () => {};

const calculateTeamsScore = ({
  newScoreValue,
  prevRoundScore,
  opponent,
}: Omit<CalculateRoundScoreProps<TeamScore>, 'gameMode'>): RoundScore => {
  const { totalRoundScore, teamsScores } = prevRoundScore;

  const scoreDifference = totalRoundScore - newScoreValue;
  const isScoreLower = scoreDifference < totalRoundScore / 2;

  if (isScoreLower) {
    return {
      ...prevRoundScore,
      teamsScores: teamsScores.map((teamScore) => {
        if (teamScore.id === opponent.id) {
          return {
            ...teamScore,
            score: totalRoundScore,
          };
        }

        return {
          ...teamScore,
          score: -1,
        };
      }),
    };
  }

  return {
    ...prevRoundScore,
    teamsScores: teamsScores.map((teamScore) => {
      if (teamScore.id === opponent.id) {
        return {
          ...teamScore,
          score: newScoreValue,
        };
      }

      return {
        ...teamScore,
        score: scoreDifference,
      };
    }),
  };
};

export const calculateRoundScore = <T extends PlayerScore | TeamScore>({
  gameMode,
  newScoreValue,
  prevRoundScore,
  opponent,
}: CalculateRoundScoreProps<T>): RoundScore => {
  let roundScore = { ...prevRoundScore };

  if (gameMode === 'classic') {
    calculatePlayersScore();
  } else {
    roundScore = calculateTeamsScore({
      newScoreValue,
      prevRoundScore,
      opponent: opponent as TeamScore,
    });
  }

  return roundScore;
};
