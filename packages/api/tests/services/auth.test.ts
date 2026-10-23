import type { LoginInput, RegisterInput, User } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession, login, logout, register } from "../../src/services/auth";
import { apiFetch } from "../../src/services/client";

vi.mock("../../src/services/client", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

describe("auth services", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("registers with JSON and includes cookies by default", async () => {
    const input: RegisterInput = {
      username: "player",
      email: "player@example.com",
      password: "password",
    };
    const response = { user: { id: "u1" } as User, token: "token", expiresAt: "later" };
    apiFetchMock.mockResolvedValue(response);

    await expect(register("https://api.example/", input)).resolves.toBe(response);
    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/auth/register", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("logs in against a base URL without a trailing slash", async () => {
    const input: LoginInput = { identifier: "player", password: "password" };
    apiFetchMock.mockResolvedValue({ user: { id: "u1" }, token: "token", expiresAt: "later" });

    await login("https://api.example", input);

    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/auth/login", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("gets a session with the requested credentials and bearer token", async () => {
    const user = { id: "u1" } as User;
    apiFetchMock.mockResolvedValue({ user });

    await expect(
      getSession("https://api.example/", { credentials: "same-origin", token: "secret" }),
    ).resolves.toEqual({ user });
    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/auth/session", {
      credentials: "same-origin",
      headers: { Authorization: "Bearer secret" },
    });
  });

  it("logs out with default credentials and no authorization header", async () => {
    apiFetchMock.mockResolvedValue(null);

    await expect(logout("https://api.example", { token: "" })).resolves.toBeNull();
    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/auth/logout", {
      credentials: "include",
      headers: undefined,
      method: "POST",
    });
  });
});
