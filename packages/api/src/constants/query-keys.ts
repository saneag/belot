import { InitGameInput, ListGamesParams } from "../types";

export const gameKeys = {
  all: ["games"] as const,
  lists: () => [...gameKeys.all, "list"] as const,
  list: (params?: ListGamesParams) => [...gameKeys.lists(), params] as const,
  init: (input: InitGameInput) => [...gameKeys.all, "init", input] as const,
};
