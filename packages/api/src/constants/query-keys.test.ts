import { GameMode, Player, Team } from "@belot/types";
import { describe, expect, it } from "vitest";

import { gameKeys } from "./query-keys";

describe("gameKeys", () => {
  it("all and lists return stable key prefixes", () => {
    expect(gameKeys.all).toEqual(["games"]);
    expect(gameKeys.lists()).toEqual(["games", "list"]);
  });

  it("list includes params in the key", () => {
    expect(gameKeys.list()).toEqual(["games", "list", undefined]);
    expect(gameKeys.list({ page: 1, limit: 10 })).toEqual(["games", "list", { page: 1, limit: 10 }]);
  });

  it("init includes input in the key", () => {
    const players: Player[] = [{ id: 0, name: "A" }];
    const teams: Team[] = [{ id: 0, name: "T1", playersIds: [0] }];
    const input = { players, mode: GameMode.classic, teams };

    expect(gameKeys.init(input)).toEqual(["games", "init", input]);
  });
});
