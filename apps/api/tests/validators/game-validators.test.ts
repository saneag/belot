import express, { type RequestHandler } from "express";
import { describe, expect, it } from "vitest";
import request from "supertest";

import { GameValidators } from "../../validators/game-validators";

const validId = "507f1f77bcf86cd799439011";

const validPlayers = [
  { id: 0, name: "Alice", teamId: 0 },
  { id: 1, name: "Bob", teamId: 0 },
  { id: 2, name: "Carol", teamId: 1 },
  { id: 3, name: "Dave", teamId: 1 },
];

const validTeams = [
  { id: 0, name: "A", playersIds: [0, 1] },
  { id: 1, name: "B", playersIds: [2, 3] },
];

const validRoundScore = {
  id: 0,
  playersScores: [
    { id: 0, score: 10, boltCount: 0, totalScore: 10, playerId: 0 },
  ],
  teamsScores: [{ id: 0, score: 10, boltCount: 0, totalScore: 10, teamId: 0 }],
  totalRoundScore: 10,
  roundPlayer: { id: 0, name: "Alice" },
};

function createApp(validators: RequestHandler[]) {
  const app = express();
  app.use(express.json());
  app.post("/test", ...validators, (_req, res) => res.status(200).json({ ok: true }));
  app.patch("/test/:id", ...validators, (_req, res) => res.status(200).json({ ok: true }));
  app.get("/test", ...validators, (_req, res) => res.status(200).json({ ok: true }));
  app.get("/test/:id", ...validators, (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe("GameValidators", () => {
  it("initGame rejects invalid payloads", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({ players: [{ id: 0, name: "Alice" }], mode: "classic", teams: [] });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("initGame accepts valid payloads", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(200);
  });

  it("initGame accepts optional round and dealer fields", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: validPlayers,
        mode: "teams",
        dealer: null,
        teams: validTeams,
        roundsScores: [validRoundScore],
        undoneRoundsScores: [validRoundScore],
        isFinished: false,
      });

    expect(response.status).toBe(200);
  });

  it("initGame requires teamId for four players", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
          { id: 2, name: "Carol" },
          { id: 3, name: "Dave" },
        ],
        mode: "teams",
        teams: validTeams,
      });

    expect(response.status).toBe(400);
  });

  it("initGame rejects invalid nested player fields", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [{ id: "bad", name: "Alice" }, { id: 1, name: "Bob" }],
        mode: "classic",
        teams: [],
      });

    expect(response.status).toBe(400);
  });

  it("initGame rejects invalid team payloads", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [{ id: 0, name: "A", playersIds: ["bad"] }],
      });

    expect(response.status).toBe(400);
  });

  it("initGame rejects invalid round score payloads", async () => {
    const app = createApp(GameValidators.initGame);

    const response = await request(app)
      .post("/test")
      .send({
        players: [
          { id: 0, name: "Alice" },
          { id: 1, name: "Bob" },
        ],
        mode: "classic",
        teams: [],
        roundsScores: [{ id: 0, playersScores: [], teamsScores: [], totalRoundScore: "bad" }],
      });

    expect(response.status).toBe(400);
  });

  it("updateGame rejects unknown fields", async () => {
    const app = createApp(GameValidators.updateGame);

    const response = await request(app)
      .patch(`/test/${validId}`)
      .send({ unexpected: true });

    expect(response.status).toBe(400);
  });

  it("updateGame rejects empty body", async () => {
    const app = createApp(GameValidators.updateGame);

    const response = await request(app).patch(`/test/${validId}`).send({});

    expect(response.status).toBe(400);
  });

  it("updateGame accepts valid patch payloads", async () => {
    const app = createApp(GameValidators.updateGame);

    const response = await request(app)
      .patch(`/test/${validId}`)
      .send({ isFinished: true });

    expect(response.status).toBe(200);
  });

  it("updateGame accepts dealer, rounds, and undone rounds", async () => {
    const app = createApp(GameValidators.updateGame);

    const response = await request(app)
      .patch(`/test/${validId}`)
      .send({
        dealer: { id: 0, name: "Alice" },
        roundsScores: [validRoundScore],
        undoneRoundsScores: [validRoundScore],
      });

    expect(response.status).toBe(200);
  });

  it("updateGame rejects invalid dealer payloads", async () => {
    const app = createApp(GameValidators.updateGame);

    const response = await request(app)
      .patch(`/test/${validId}`)
      .send({ dealer: { id: 0, name: 123 } });

    expect(response.status).toBe(400);
  });

  it("updateGame rejects invalid round payloads", async () => {
    const app = createApp(GameValidators.updateGame);

    const response = await request(app)
      .patch(`/test/${validId}`)
      .send({ roundsScores: [{ id: 0 }] });

    expect(response.status).toBe(400);
  });

  it("listGames validates query params", async () => {
    const app = createApp(GameValidators.listGames);

    const invalid = await request(app).get("/test").query({ page: 0 });
    expect(invalid.status).toBe(400);

    const valid = await request(app).get("/test").query({ page: 1, limit: 10 });
    expect(valid.status).toBe(200);
  });

  it("gameIdParam rejects invalid ids", async () => {
    const app = createApp(GameValidators.gameIdParam);

    const response = await request(app).get("/test/not-an-id");
    expect(response.status).toBe(400);
  });

  it("gameIdParam accepts valid ids", async () => {
    const app = createApp(GameValidators.gameIdParam);

    const response = await request(app).get(`/test/${validId}`);
    expect(response.status).toBe(200);
  });
});
