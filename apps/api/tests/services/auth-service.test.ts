import { scryptSync } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createSession,
  getUserForToken,
  login,
  logout,
  normalizeEmail,
  normalizeUsername,
  provisionAdmin,
  register,
} from "../../services/auth-service";

const mocks = vi.hoisted(() => ({
  sessionCreate: vi.fn(),
  sessionFindOne: vi.fn(),
  sessionDeleteOne: vi.fn(),
  userCreate: vi.fn(),
  userFindOne: vi.fn(),
  userUpdateOne: vi.fn(),
}));

vi.mock("../../schemas/session-schema", () => ({
  default: {
    create: mocks.sessionCreate,
    findOne: mocks.sessionFindOne,
    deleteOne: mocks.sessionDeleteOne,
  },
}));

vi.mock("../../schemas/user-schema", () => ({
  default: {
    create: mocks.userCreate,
    findOne: mocks.userFindOne,
    updateOne: mocks.userUpdateOne,
  },
}));

const user = {
  _id: "user-id",
  username: "player",
  email: "player@example.com",
  role: "user" as const,
  passwordHash: scryptSync("password123", "password-salt", 64).toString("hex"),
  passwordSalt: "password-salt",
};

type UserQuery = Promise<unknown> & { where: () => UserQuery; select: () => UserQuery };
type SessionQuery = Promise<unknown> & {
  where: () => SessionQuery;
  populate: () => SessionQuery;
};

let userLookupResult: unknown;
let sessionLookupResult: unknown;

function makeUserQuery(): UserQuery {
  const query = Promise.resolve(userLookupResult) as UserQuery;
  query.where = () => query;
  query.select = () => query;
  return query;
}

function makeSessionQuery(): SessionQuery {
  const query = Promise.resolve(sessionLookupResult) as SessionQuery;
  query.where = () => query;
  query.populate = () => query;
  return query;
}

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userLookupResult = user;
    sessionLookupResult = null;
    mocks.userFindOne.mockImplementation(makeUserQuery);
    mocks.sessionFindOne.mockImplementation(makeSessionQuery);
    mocks.sessionCreate.mockResolvedValue(undefined);
    mocks.sessionDeleteOne.mockResolvedValue({ deletedCount: 1 });
    mocks.userCreate.mockResolvedValue(user);
    mocks.userUpdateOne.mockResolvedValue({ acknowledged: true });
  });

  it("normalizes usernames and email addresses", () => {
    expect(normalizeUsername(" Player ")).toBe("player");
    expect(normalizeEmail(" PLAYER@EXAMPLE.COM ")).toBe("player@example.com");
  });

  it.each([
    ["ab", "person@example.com", "password123", "Username must be at least 3 characters"],
    ["invalid name", "person@example.com", "password123", "Username must be at least 3 characters"],
    ["player", "invalid", "password123", "Email is invalid"],
    ["player", "a".repeat(253) + "@x", "password123", "Email is invalid"],
    ["player", "person@example.com", "short", "Password must be at least 8 characters"],
  ])("rejects invalid credentials", async (username, email, password, message) => {
    await expect(register({ username, email, password })).rejects.toThrow(message);
  });

  it("rejects a duplicate account", async () => {
    await expect(
      register({ username: "player", email: "player@example.com", password: "password123" }),
    ).rejects.toThrow("Unable to create account with those details");
  });

  it("registers a user and creates a session", async () => {
    userLookupResult = null;

    const result = await register({
      username: " Player ",
      email: " PLAYER@example.com ",
      password: "password123",
    });

    expect(mocks.userCreate).toHaveBeenCalledWith(
      expect.objectContaining({ username: "player", email: "player@example.com" }),
    );
    expect(result.user).toEqual({
      id: "user-id",
      username: "player",
      email: "player@example.com",
      role: "user",
    });
    expect(result.token).toBeTruthy();
    expect(mocks.sessionCreate).toHaveBeenCalledOnce();
  });

  it("creates a session for a user", async () => {
    const result = await createSession({
      id: "user-id",
      username: "player",
      email: "player@example.com",
      role: "user",
    });

    expect(result.expiresAt).toEqual(expect.any(String));
    expect(result.token).toBeTruthy();
    expect(mocks.sessionCreate).toHaveBeenCalledOnce();
  });

  it("rejects login when the account is missing or the password is wrong", async () => {
    userLookupResult = null;
    await expect(login({ identifier: "unknown", password: "password123" })).rejects.toThrow(
      "Invalid credentials",
    );

    userLookupResult = user;
    await expect(login({ identifier: "player", password: "wrong-password" })).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("logs in with a username or email and creates a session", async () => {
    const result = await login({ identifier: " PLAYER ", password: "password123" });

    expect(result.user.id).toBe("user-id");
    expect(mocks.sessionCreate).toHaveBeenCalledOnce();
  });

  it("returns null for missing sessions or sessions without users", async () => {
    await expect(getUserForToken("missing")).resolves.toBeNull();
    sessionLookupResult = { user: null };
    await expect(getUserForToken("no-user")).resolves.toBeNull();
  });

  it("returns the user for an active session token", async () => {
    sessionLookupResult = { user };

    await expect(getUserForToken("valid-token")).resolves.toEqual({
      id: "user-id",
      username: "player",
      email: "player@example.com",
      role: "user",
    });
  });

  it("deletes a session on logout", async () => {
    await logout("token");

    expect(mocks.sessionDeleteOne).toHaveBeenCalledOnce();
  });

  it("skips admin provisioning when environment values are missing", async () => {
    delete process.env.AUTH_ADMIN_USERNAME;
    delete process.env.AUTH_ADMIN_EMAIL;
    delete process.env.AUTH_ADMIN_PASSWORD;

    await provisionAdmin();

    expect(mocks.userUpdateOne).not.toHaveBeenCalled();
  });

  it("provisions an admin account from environment values", async () => {
    process.env.AUTH_ADMIN_USERNAME = "Admin";
    process.env.AUTH_ADMIN_EMAIL = "ADMIN@example.com";
    process.env.AUTH_ADMIN_PASSWORD = "admin-password";

    await provisionAdmin();

    expect(mocks.userUpdateOne).toHaveBeenCalledOnce();
    delete process.env.AUTH_ADMIN_USERNAME;
    delete process.env.AUTH_ADMIN_EMAIL;
    delete process.env.AUTH_ADMIN_PASSWORD;
  });
});
