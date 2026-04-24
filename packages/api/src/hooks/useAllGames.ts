import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { gameKeys } from "../constants";
import { getAllGames } from "../services";
import type { ListGamesParams, ListGamesResponse } from "../types";

export function useAllGames(
  baseUrl: string,
  params?: ListGamesParams,
  options?: Omit<UseQueryOptions<ListGamesResponse, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: gameKeys.list(params),
    queryFn: () => getAllGames(baseUrl, params),
    enabled: Boolean(baseUrl),
    ...options,
  });
}
