import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import { GameSlice } from '../store/game.slice';
import { PlayersSlice } from '../store/players.slice';
import { RoundSlice } from '../store/rounds.slice';
import {
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

  if (!lastRoundScore) {
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

  if (!lastRoundScore) {
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
      score: teamScore.score,
    })
  );

  return newTeamsScore;
};

export const prepareEmptyRoundScoreRow = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
): RoundScore => {
  const lastRoundScore = state.roundsScores.at(-1);

  return {
    id: (lastRoundScore?.id || 0) + 1,
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
