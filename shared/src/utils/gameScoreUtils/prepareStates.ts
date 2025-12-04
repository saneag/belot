import { DEFAULT_ROUND_POINTS } from '../../constants';
import { GameSlice } from '../../store/game.slice';
import { PlayersSlice } from '../../store/players.slice';
import { RoundSlice } from '../../store/rounds.slice';
import {
  GameMode,
  Player,
  PlayerScore,
  RoundScore,
  Team,
  TeamScore,
} from '../../types';

const preparePlayersScores = (
  state: RoundSlice & Partial<PlayersSlice> & Partial<GameSlice>
): PlayerScore[] => {
  const mode = state.mode;
  const lastRoundScore = state.roundsScores.at(-1);
  const players = state.players;

  if (mode === GameMode.teams || !players) return [];

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

  if (mode === GameMode.classic || !teams) return [];

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

export const prepareTeams = (players: Player[], mode: GameMode): Team[] => {
  return mode === GameMode.classic
    ? []
    : [
        {
          id: 0,
          playersIds: [players[0].id, players[2].id],
          name: 'N',
        },
        {
          id: 1,
          playersIds: [players[1].id, players[3].id],
          name: 'V',
        },
      ];
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
