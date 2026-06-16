import express, { type RequestHandler } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { GameValidators } from "../../validators/game-validators";

const validId = "507f1f77bcf86cd799439011";

function createPostApp(validators: RequestHandler[]) {
  const app = express();
  app.use(express.json());
  app.post("/test", ...validators, (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe("GameValidators edge cases", () => {
  it("rejects non-object players in initGame", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: ["bad", { id: 1, name: "Bob" }],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(400);
  });

  it("rejects players without names", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: 123 },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid teamId types", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice", teamId: "bad" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(400);
  });

  it("rejects non-object teams", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: ["bad"],
      });

    expect(response.status).toBe(400);
  });

  it("rejects teams without playersIds array", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [{ id: 0, name: "A", playersIds: "bad" }],
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid dealer objects", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        dealer: { id: 0 },
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid player score rows", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: 0,
            playersScores: [{ id: 0, score: 10, boltCount: 0, totalScore: 10 }],
            teamsScores: [],
            totalRoundScore: 10,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid team score rows", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: 0,
            playersScores: [],
            teamsScores: [{ id: 0, score: 10, boltCount: 0, totalScore: 10 }],
            totalRoundScore: 10,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid round player objects", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: 0,
            playersScores: [],
            teamsScores: [],
            totalRoundScore: 10,
            roundPlayer: { id: 0 },
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects non-object round scores", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        undoneRoundsScores: ["bad"],
      });

    expect(response.status).toBe(400);
  });

  it("rejects invalid mongo id on updateGame", async () => {
    const app = express();
    app.use(express.json());
    app.patch("/test/:id", ...GameValidators.updateGame, (_req, res) =>
      res.status(200).json({ ok: true }),
    );

    const response = await request(app).patch("/test/not-valid").send({ isFinished: true });
    expect(response.status).toBe(400);
  });

  it("accepts null dealer on updateGame", async () => {
    const app = express();
    app.use(express.json());
    app.patch("/test/:id", ...GameValidators.updateGame, (_req, res) =>
      res.status(200).json({ ok: true }),
    );

    const response = await request(app).patch(`/test/${validId}`).send({ dealer: null });

    expect(response.status).toBe(200);
  });

  it("rejects round scores without numeric ids", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: "bad",
            playersScores: [],
            teamsScores: [],
            totalRoundScore: 10,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects round scores without playersScores arrays", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: 0,
            playersScores: "bad",
            teamsScores: [],
            totalRoundScore: 10,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects round scores without teamsScores arrays", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: 0,
            playersScores: [],
            teamsScores: "bad",
            totalRoundScore: 10,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects base score rows missing numeric fields", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [
          {
            id: 0,
            playersScores: [{ id: 0, score: "bad", boltCount: 0, totalScore: 10, playerId: 0 }],
            teamsScores: [],
            totalRoundScore: 10,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it("rejects teams without numeric ids", async () => {
    const app = createPostApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [{ id: "bad", name: "A", playersIds: [0] }],
      });

    expect(response.status).toBe(400);
  });
});
