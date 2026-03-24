import { apiFetch } from "./client";

export type ListGamesParams = {
  page?: number;
  limit?: number;
};

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

export type ListGamesResponse = {
  games: ApiGame[];
  page: number;
  limit: number;
  total: number;
};

export function buildGamesListUrl(baseUrl: string, params?: ListGamesParams): string {
  const normalized = baseUrl.replace(/\/$/, "");
  const url = new URL(`${normalized}/games`);
  if (params?.page != null) {
    url.searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    url.searchParams.set("limit", String(params.limit));
  }
  return url.toString();
}

export async function getAllGames(
  baseUrl: string,
  params?: ListGamesParams,
): Promise<ListGamesResponse> {
  return apiFetch<ListGamesResponse>(buildGamesListUrl(baseUrl, params));
}
