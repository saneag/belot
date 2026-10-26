import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdmin, requireAuth } from "../../middleware/auth";
import { errorHandler } from "../../middleware/error-handler";
import authRouter from "../../routes/auth-router";

const mocks = vi.hoisted(() => ({
  getUserForToken: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../../services/auth-service", () => ({
  getUserForToken: mocks.getUserForToken,
  login: mocks.login,
  logout: mocks.logout,
  register: mocks.register,
}));

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.get("/admin", requireAuth, requireAdmin, (_req, res) => res.sendStatus(204));
app.use(errorHandler);

const user = { id: "user-id", username: "player", email: "player@example.com", role: "user" };
const session = { user, token: "session-token", expiresAt: "2030-01-01T00:00:00.000Z" };

describe("auth router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.AUTH_SESSION_COOKIE_NAME;
    mocks.register.mockResolvedValue(session);
    mocks.login.mockResolvedValue(session);
    mocks.logout.mockResolvedValue(undefined);
    mocks.getUserForToken.mockResolvedValue(user);
  });

  it("registers users and sets the session cookie", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "player",
      email: "player@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ session });
    expect(response.headers["set-cookie"]?.toString()).toContain("belot_session=session-token");
    expect(mocks.register).toHaveBeenCalledWith({
      username: "player",
      email: "player@example.com",
      password: "password123",
    });
  });

  it.each([{}, [], { username: 1, email: "player@example.com", password: "password123" }])(
    "rejects invalid registration bodies",
    async (body) => {
      const response = await request(app).post("/auth/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Username, email, and password are required" });
    },
  );

  it("rejects a null registration body", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .send("null");

    expect(response.status).toBe(400);
  });

  it("returns service errors from registration", async () => {
    mocks.register.mockRejectedValueOnce(Object.assign(new Error("invalid"), { status: 400 }));

    const response = await request(app)
      .post("/auth/register")
      .send({ username: "player", email: "player@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "invalid" });
  });

  it("logs users in and sets a session cookie", async () => {
    process.env.AUTH_SESSION_COOKIE_NAME = "custom_session";

    const response = await request(app)
      .post("/auth/login")
      .send({ identifier: "player", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]?.toString()).toContain("custom_session=session-token");
    expect(mocks.login).toHaveBeenCalledWith({ identifier: "player", password: "password123" });
  });

  it.each([{}, { identifier: "player" }, { identifier: 1, password: "password123" }])(
    "rejects invalid login bodies",
    async (body) => {
      const response = await request(app).post("/auth/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Identifier and password are required" });
    },
  );

  it("returns service errors from login", async () => {
    mocks.login.mockRejectedValueOnce(new Error("unexpected"));

    const response = await request(app)
      .post("/auth/login")
      .send({ identifier: "player", password: "password123" });

    expect(response.status).toBe(500);
  });

  it("returns the authenticated session user from a cookie", async () => {
    const response = await request(app)
      .get("/auth/session")
      .set("Cookie", "other=x; belot_session=abc");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user });
    expect(mocks.getUserForToken).toHaveBeenCalledWith("abc");
  });

  it("accepts bearer tokens and rejects missing or invalid sessions", async () => {
    const response = await request(app).get("/auth/session").set("Authorization", "Bearer token-1");
    expect(response.status).toBe(200);
    expect(mocks.getUserForToken).toHaveBeenCalledWith("token-1");

    const missing = await request(app).get("/auth/session");
    expect(missing.status).toBe(401);

    mocks.getUserForToken.mockResolvedValueOnce(null);
    const invalid = await request(app).get("/auth/session").set("Cookie", "belot_session=expired");
    expect(invalid.status).toBe(401);

    const unmatchedCookie = await request(app).get("/auth/session").set("Cookie", "other=value");
    expect(unmatchedCookie.status).toBe(401);

    mocks.getUserForToken.mockRejectedValueOnce(new Error("database unavailable"));
    const failure = await request(app).get("/auth/session").set("Authorization", "Bearer token-2");
    expect(failure.status).toBe(500);
  });

  it("allows only an authenticated admin to access admin routes", async () => {
    expect(
      (await request(app).get("/admin").set("Authorization", "Bearer user-token")).status,
    ).toBe(403);

    mocks.getUserForToken.mockResolvedValueOnce({ ...user, role: "admin" });
    expect(
      (await request(app).get("/admin").set("Authorization", "Bearer admin-token")).status,
    ).toBe(204);
  });

  it("logs out an authenticated user and clears the cookie", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("Authorization", "Bearer session-token");

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]?.toString()).toContain("belot_session=;");
    expect(mocks.logout).toHaveBeenCalledWith("session-token");
  });

  it("returns errors raised while logging out", async () => {
    mocks.logout.mockRejectedValueOnce(new Error("database unavailable"));

    const response = await request(app)
      .post("/auth/logout")
      .set("Authorization", "Bearer session-token");

    expect(response.status).toBe(500);
  });
});
