import type { Player, PlayerScore, RoundScore, RoundSlice, Team, TeamScore } from "@belot/types";

import { DEFAULT_ROUND_POINTS } from "./../../constants/src/gameConstants";

export const basePlayerScore = (
  partial: Partial<PlayerScore> & Pick<PlayerScore, "id" | "playerId">,
): PlayerScore => ({
  score: 0,
  boltCount: 0,
  totalScore: 0,
  ...partial,
});

export const baseTeamScore = (
  partial: Partial<TeamScore> & Pick<TeamScore, "id" | "teamId">,
): TeamScore => ({
  score: 0,
  boltCount: 0,
  totalScore: 0,
  ...partial,
});

export const baseRoundScore = (
  partial: Partial<RoundScore> & Pick<RoundScore, "id">,
): RoundScore => ({
  playersScores: [],
  teamsScores: [],
  totalRoundScore: 0,
  roundPlayer: null,
  ...partial,
});

export const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Player 1",
    teamId: 1,
  },
  {
    id: 2,
    name: "Player 2",
    teamId: 2,
  },
  {
    id: 3,
    name: "Player 3",
    teamId: 1,
  },
  {
    id: 4,
    name: "Player 4",
    teamId: 2,
  },
];

export const mockTeams: Team[] = [
  {
    id: 1,
    playersIds: [1, 3],
    name: "N",
  },
  {
    id: 2,
    playersIds: [2, 4],
    name: "V",
  },
];

export const mockDealer: Player = mockPlayers[0];

export const mockPlayersScores: PlayerScore[] = [
  basePlayerScore({ id: 1, playerId: 1, score: 72 }),
  basePlayerScore({ id: 2, playerId: 2, score: 35 }),
  basePlayerScore({ id: 3, playerId: 3, score: 55 }),
];

export const mockTeamsScores: TeamScore[] = [
  baseTeamScore({ id: 1, teamId: 1, score: 72 }),
  baseTeamScore({ id: 2, teamId: 2, score: 35 }),
];

export const mockRoundScores: RoundScore[] = [
  baseRoundScore({
    id: 1,
    playersScores: mockPlayersScores,
    teamsScores: mockTeamsScores,
    totalRoundScore: DEFAULT_ROUND_POINTS,
  }),
];

export const mockRoundSlice: RoundSlice = {
  roundsScores: [],
  dealer: null,
  undoneRoundsScores: [],
  setDealer: () => {},
  setRoundsScores: () => {},
  updateRoundScore: () => {},
  setEmptyRoundScore: () => {},
  skipRound: () => {},
  undoRoundScore: () => {},
  redoRoundScore: () => {},
};
