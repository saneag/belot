import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameService } from "../../services/game-service";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../config/postgres.js", () => ({ pool: { query } }));
describe("PostgreSQL games", () => {
  beforeEach(() => query.mockReset());
  it("rejects invalid IDs without querying", async () => {
    expect(await GameService.getGameById("bad")).toBeNull();
    expect(await GameService.updateGameById("bad", {})).toBeNull();
    expect(query).not.toHaveBeenCalled();
  });
  it("returns null for a missing game", async () => {
    query.mockResolvedValue({ rows: [] });
    expect(await GameService.getGameById("507f1f77bcf86cd799439011")).toBeNull();
  });
  it("binds update values and ignores fields outside the patch contract", async () => {
    query.mockResolvedValue({ rows: [] });
    await GameService.updateGameById("507f1f77bcf86cd799439011", {
      isFinished: true,
      players: ["injected"],
    } as never);
    expect(query.mock.calls[0]![1]).toEqual(["507f1f77bcf86cd799439011", { isFinished: true }]);
  });
  it("maps dates and pagination without exposing storage columns", async () => {
    const date = new Date("2026-01-01");
    query.mockResolvedValueOnce({ rows: [{ total: "3" }] }).mockResolvedValueOnce({
      rows: [{ id: "a", data: { mode: "classic" }, created_at: date, updated_at: date }],
    });
    const result = await GameService.listGames(2, 1);
    expect(result.total).toBe(3);
    expect(result.games[0]).toEqual({
      id: "a",
      mode: "classic",
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
    expect(query.mock.calls[1]![1]).toEqual([1, 1]);
  });
});
