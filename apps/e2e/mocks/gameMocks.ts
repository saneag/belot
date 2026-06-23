import type { Player, RoundScore, Team } from "@belot/types";

export const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Player 1",
  },
  {
    id: 2,
    name: "Player 2",
  },
  {
    id: 3,
    name: "Player 3",
  },
];

export const mockTeamsPlayers: Player[] = [
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

export const mockRoundsScores: RoundScore[] = [
  {
    id: 1,
    playersScores: [],
    teamsScores: [
      { id: 1, teamId: 1, score: 62, boltCount: 0, totalScore: 62 },
      { id: 2, teamId: 2, score: 90, boltCount: 0, totalScore: 90 },
    ],
    totalRoundScore: 152,
  },
];
