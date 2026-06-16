// @vitest-environment jsdom
import useGetPlayersNamesWithScoreColumn from "@/hooks/game-table/useGetPlayersNamesWithScoreColumn";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const storeMocks = vi.hoisted(() => ({
  players: [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
  ],
  teams: [{ id: 0, name: "Team A", playersIds: [0, 1] }],
  mode: "classic",
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: typeof storeMocks) => unknown) => selector(storeMocks),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Score",
}));

vi.mock("@belot/utils/src", () => ({
  getPlayersNames: (players: { name: string }[]) => players.map((player) => player.name),
  getTeamsNames: (teams: { name: string }[]) => teams.map((team) => team.name),
}));

describe("useGetPlayersNamesWithScoreColumn", () => {
  it("returns player names with score column in classic mode", () => {
    storeMocks.mode = "classic";

    const { result } = renderHook(() => useGetPlayersNamesWithScoreColumn());

    expect(result.current.playersNamesWithScoreColumn).toEqual(["Alice", "Bob", "Score"]);
    expect(result.current.columnsCount).toBe(2);
  });

  it("returns team names with score column in teams mode", () => {
    storeMocks.mode = "teams";

    const { result } = renderHook(() => useGetPlayersNamesWithScoreColumn());

    expect(result.current.playersNamesWithScoreColumn).toEqual(["Team A", "Score"]);
    expect(result.current.columnsCount).toBe(1);
  });
});
