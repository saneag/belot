import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import gamesRouter from "../../routes/games-router";

const mocks = vi.hoisted(() => ({
  initGame: vi.fn(),
  listGames: vi.fn(),
  getGameById: vi.fn(),
  updateGameById: vi.fn(),
}));

vi.mock("../../services/game-service", () => ({
  GameService: {
    initGame: mocks.initGame,
    listGames: mocks.listGames,
    getGameById: mocks.getGameById,
    updateGameById: mocks.updateGameById,
  },
}));

const app = express();
app.use(express.json());
app.use("/games", gamesRouter);

const validId = "507f1f77bcf86cd799439011";

describe("games router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /init creates a game", async () => {
    mocks.initGame.mockResolvedValue({ id: validId });

    const response = await request(app)
      .post("/games/init")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: validId });
  });

  it("POST /init returns 500 on service errors", async () => {
    mocks.initGame.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .post("/games/init")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  it("GET / lists games with defaults", async () => {
    mocks.listGames.mockResolvedValue({ games: [], page: 1, limit: 100, total: 0 });

    const response = await request(app).get("/games");

    expect(response.status).toBe(200);
    expect(mocks.listGames).toHaveBeenCalledWith(1, 100);
  });

  it("GET / accepts page and limit query params", async () => {
    mocks.listGames.mockResolvedValue({ games: [], page: 2, limit: 5, total: 0 });

    const response = await request(app).get("/games").query({ page: 2, limit: 5 });

    expect(response.status).toBe(200);
    expect(mocks.listGames).toHaveBeenCalledWith(2, 5);
  });

  it("GET / returns 500 on service errors", async () => {
    mocks.listGames.mockRejectedValue(new Error("db down"));

    const response = await request(app).get("/games");

    expect(response.status).toBe(500);
  });

  it("GET /:id returns game when found", async () => {
    mocks.getGameById.mockResolvedValue({ id: validId });

    const response = await request(app).get(`/games/${validId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: validId });
  });

  it("GET /:id returns 404 when game is missing", async () => {
    mocks.getGameById.mockResolvedValue(null);

    const response = await request(app).get(`/games/${validId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Game not found" });
  });

  it("GET /:id returns 500 on service errors", async () => {
    mocks.getGameById.mockRejectedValue(new Error("db down"));

    const response = await request(app).get(`/games/${validId}`);

    expect(response.status).toBe(500);
  });

  it("PATCH /:id updates game when found", async () => {
    mocks.updateGameById.mockResolvedValue({ id: validId, isFinished: true });

    const response = await request(app).patch(`/games/${validId}`).send({ isFinished: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: validId, isFinished: true });
  });

  it("PATCH /:id returns 404 when game is missing", async () => {
    mocks.updateGameById.mockResolvedValue(null);

    const response = await request(app).patch(`/games/${validId}`).send({ isFinished: true });

    expect(response.status).toBe(404);
  });

  it("PATCH /:id returns 500 on service errors", async () => {
    mocks.updateGameById.mockRejectedValue(new Error("db down"));

    const response = await request(app).patch(`/games/${validId}`).send({ isFinished: true });

    expect(response.status).toBe(500);
  });
});
