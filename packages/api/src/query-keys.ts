import type { ListGamesParams } from "./games";

export const gameKeys = {
  all: ["games"] as const,
  lists: () => [...gameKeys.all, "list"] as const,
  list: (params?: ListGamesParams) => [...gameKeys.lists(), params] as const,
};
