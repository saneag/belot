import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  players: [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
  ],
  teams: [
    { id: 0, name: "Team A" },
    { id: 1, name: "Team B" },
  ],
  mode: "classic" as "classic" | "teams",
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Score",
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: typeof mocks) => unknown) => selector(mocks),
}));

vi.mock("@belot/utils/src", () => ({
  getPlayersNames: (players: { name: string }[]) => players.map((p) => p.name),
  getTeamsNames: (teams: { name: string }[]) => teams.map((t) => t.name),
}));

describe("useGetPlayersNamesWithScoreColumn", () => {
  beforeEach(() => {
    mocks.mode = "classic";
    mocks.players = [
      { id: 0, name: "Alice" },
      { id: 1, name: "Bob" },
    ];
    mocks.teams = [
      { id: 0, name: "Team A" },
      { id: 1, name: "Team B" },
    ];
  });

  it("returns player names with score column in classic mode", async () => {
    const { default: useGetPlayersNamesWithScoreColumn } =
      await import("@/hooks/game-table/useGetPlayersNamesWithScoreColumn");

    const { result } = renderHook(() => useGetPlayersNamesWithScoreColumn());

    expect(result.current.playersNamesWithScoreColumn).toEqual(["Alice", "Bob", "Score"]);
    expect(result.current.columnsCount).toBe(2);
  });

  it("returns team names in teams mode", async () => {
    mocks.mode = "teams";

    const { default: useGetPlayersNamesWithScoreColumn } =
      await import("@/hooks/game-table/useGetPlayersNamesWithScoreColumn");

    const { result } = renderHook(() => useGetPlayersNamesWithScoreColumn());

    expect(result.current.playersNamesWithScoreColumn).toEqual(["Team A", "Team B", "Score"]);
    expect(result.current.columnsCount).toBe(2);
  });
});
