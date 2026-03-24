import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { type ListGamesParams, type ListGamesResponse, getAllGames } from "../games";
import { gameKeys } from "../query-keys";

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
