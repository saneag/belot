import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameMode, Player, Team } from "@belot/types";

import { buildGamesListUrl, getAllGames, initGame } from "./games";

vi.mock("./client", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./client";

const apiFetchMock = vi.mocked(apiFetch);

describe("buildGamesListUrl", () => {
  it("normalizes trailing slash and builds games URL", () => {
    expect(buildGamesListUrl("https://api.example/")).toBe("https://api.example/games");
    expect(buildGamesListUrl("https://api.example")).toBe("https://api.example/games");
  });

  it("adds page and limit when provided", () => {
    expect(buildGamesListUrl("https://api.example", { page: 2, limit: 10 })).toBe(
      "https://api.example/games?page=2&limit=10",
    );
  });

  it("omits search params when page and limit are undefined", () => {
    expect(buildGamesListUrl("https://api.example", {})).toBe("https://api.example/games");
  });

  it("includes only page when limit is omitted", () => {
    expect(buildGamesListUrl("https://api.example", { page: 1 })).toBe(
      "https://api.example/games?page=1",
    );
  });

  it("includes only limit when page is omitted", () => {
    expect(buildGamesListUrl("https://api.example", { limit: 5 })).toBe(
      "https://api.example/games?limit=5",
    );
  });
});

describe("getAllGames", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("calls apiFetch with built URL", async () => {
    const response = { games: [], page: 1, limit: 10, total: 0 };
    apiFetchMock.mockResolvedValue(response);

    await expect(getAllGames("https://api.example", { page: 1 })).resolves.toBe(response);
    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/games?page=1");
  });
});

describe("initGame", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("POSTs JSON to games/init", async () => {
    const players: Player[] = [{ id: 0, name: "A" }];
    const teams: Team[] = [{ id: 0, name: "T1", playersIds: [0] }];
    const input = { players, mode: GameMode.classic, teams };

    apiFetchMock.mockResolvedValue({ id: "g1" });

    await expect(initGame("https://api.example", input)).resolves.toEqual({ id: "g1" });

    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/games/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  });
});
