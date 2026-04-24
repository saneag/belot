import { apiFetch } from "./client";
import type { InitGameInput, ListGamesParams, ListGamesResponse } from "../types";

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

export async function initGame(baseUrl: string, input: InitGameInput): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`${baseUrl}/games/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}
