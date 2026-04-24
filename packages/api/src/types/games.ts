import { GameMode, type Player, type RoundScore, type Team } from "@belot/types";

export type ApiGame = {
  id: string;
  mode: string;
  players: unknown[];
  teams: unknown[];
  dealer?: unknown;
  roundsScores?: unknown[];
  undoneRoundsScores?: unknown[];
  isFinished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ListGamesParams = {
  page?: number;
  limit?: number;
};

export type ListGamesResponse = {
  games: ApiGame[];
  page: number;
  limit: number;
  total: number;
};

export type InitGameInput = {
  players: Player[];
  mode: GameMode;
  dealer?: Player | null;
  teams: Team[];
  roundsScores?: RoundScore[];
  undoneRoundsScores?: RoundScore[];
  isFinished?: boolean;
};
