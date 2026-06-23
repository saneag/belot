import { POINTS_TYPE } from "@belot/constants";
import {
  GameMode,
  type GameSlice,
  type Player,
  type PlayerScore,
  type PlayersSlice,
  type RoundScore,
  type RoundSlice,
  type Team,
  type TeamScore,
} from "@belot/types";

import { getDefaultRoundPoints } from "../pointsTypeHelpers";

const getTeamsFromState = (
  state: Partial<RoundSlice> & Partial<PlayersSlice> & Partial<GameSlice>,
): Team[] => {
  if (state.teams && state.teams.length > 0) {
    return state.teams;
  }

  if (state.players && state.mode === GameMode.teams) {
    return prepareTeams(state.players, state.mode);
  }

  return [];
};

const preparePlayersScores = (
  state: Partial<RoundSlice> & Partial<PlayersSlice> & Partial<GameSlice>,
): PlayerScore[] => {
  const mode = state.mode;
  const lastRoundScore = state.roundsScores?.at(-1);
  const players = state.players;

  if (mode === GameMode.teams || !players) return [];

  if (lastRoundScore === undefined || lastRoundScore.playersScores.length === 0) {
    return players.map((player, index) => ({
      id: index,
      playerId: player.id,
      score: 0,
      boltCount: 0,
      totalScore: 0,
    }));
  }

  const newPlayersScore: PlayerScore[] = lastRoundScore.playersScores.map((playerScore) => ({
    id: playerScore.id,
    playerId: playerScore.playerId,
    score: 0,
    boltCount: playerScore.boltCount,
    totalScore: playerScore.totalScore,
  }));

  return newPlayersScore;
};

const prepareTeamsScores = (
  state: Partial<RoundSlice> & Partial<PlayersSlice> & Partial<GameSlice>,
): TeamScore[] => {
  const { mode, roundsScores } = state;
  const teams = getTeamsFromState(state);
  const lastRoundScore = roundsScores?.at(-1);

  if (mode === GameMode.classic || teams.length === 0) return [];

  if (lastRoundScore === undefined || lastRoundScore.teamsScores.length === 0) {
    return teams.map((team, index) => ({
      id: index,
      teamId: team.id,
      score: 0,
      boltCount: 0,
      totalScore: 0,
    }));
  }

  const newTeamsScore: TeamScore[] = lastRoundScore.teamsScores.map((teamScore) => ({
    id: teamScore.id,
    teamId: teamScore.teamId,
    score: 0,
    boltCount: teamScore.boltCount,
    totalScore: teamScore.totalScore,
  }));

  return newTeamsScore;
};

export const prepareEmptyRoundScoreRow = (
  state: Partial<RoundSlice> & Partial<PlayersSlice> & Partial<GameSlice>,
): RoundScore => {
  const lastRoundScore = state.roundsScores?.at(-1);
  const pointsType = state.pointsType ?? POINTS_TYPE[0].id;

  return {
    id: lastRoundScore?.id !== undefined ? lastRoundScore.id + 1 : 0,
    playersScores: preparePlayersScores(state),
    teamsScores: prepareTeamsScores(state),
    totalRoundScore: getDefaultRoundPoints(pointsType),
    roundPlayer: null,
  };
};

export const repairRoundScoreScores = (
  roundScore: RoundScore,
  state: Partial<RoundSlice> & Partial<PlayersSlice> & Partial<GameSlice>,
): RoundScore => {
  const previousRounds = state.roundsScores?.slice(0, -1) ?? [];
  const template = prepareEmptyRoundScoreRow({ ...state, roundsScores: previousRounds });

  return {
    ...roundScore,
    playersScores:
      roundScore.playersScores.length > 0 ? roundScore.playersScores : template.playersScores,
    teamsScores: roundScore.teamsScores.length > 0 ? roundScore.teamsScores : template.teamsScores,
  };
};

export const preparePreviousRoundScoreRow = (
  previousRoundScore: RoundScore,
  undoneRoundScore: RoundScore,
  pointsType: string = POINTS_TYPE[0].id,
): RoundScore => {
  return {
    id: undoneRoundScore.id,
    playersScores: previousRoundScore.playersScores.map((playerScore) => ({
      ...playerScore,
      score: 0,
    })),
    teamsScores: previousRoundScore.teamsScores.map((teamScore) => ({
      ...teamScore,
      score: 0,
    })),
    totalRoundScore: getDefaultRoundPoints(pointsType),
    roundPlayer: null,
  };
};

export const prepareTeams = (players: Player[], mode: GameMode): Team[] => {
  return mode === GameMode.classic
    ? []
    : [
        {
          id: 0,
          playersIds: [players[0].id, players[2].id],
          name: "N",
        },
        {
          id: 1,
          playersIds: [players[1].id, players[3].id],
          name: "V",
        },
      ];
};

export const prepareRoundScoresBasedOnGameMode = (
  gameMode: GameMode,
  roundScore: RoundScore,
  opponent: PlayerScore | TeamScore,
) => {
  return gameMode === GameMode.classic
    ? roundScore.playersScores.find((playersScore) => playersScore.id === opponent.id)
    : roundScore.teamsScores.find((teamsScore) => teamsScore.id === opponent.id);
};
