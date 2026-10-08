import React from "react";

import { AuthProvider, useAuth } from "@/auth/authContext";

import { cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  getFromStorage: vi.fn(),
  removeFromStorage: vi.fn(),
  setToStorage: vi.fn(),
  getApiBaseUrl: vi.fn(() => "https://api.example"),
}));

vi.mock("@belot/api-client", () => ({
  getSession: mocks.getSession,
  login: mocks.login,
  logout: mocks.logout,
  register: mocks.register,
}));

vi.mock("@/helpers/storageHelpers", () => ({
  getFromStorage: mocks.getFromStorage,
  removeFromStorage: mocks.removeFromStorage,
  setToStorage: mocks.setToStorage,
}));

vi.mock("@/helpers/apiBaseUrl", () => ({ getApiBaseUrl: mocks.getApiBaseUrl }));

const user = { id: "u1", username: "player", email: "player@example.com", role: "user" as const };
const session = { user, token: "session-token", expiresAt: "2030-01-01T00:00:00.000Z" };

function Consumer() {
  const auth = useAuth();
  return (
    <div>
      <span>{auth.loading ? "loading" : (auth.user?.username ?? "guest")}</span>
      <button onClick={() => void auth.signIn({ identifier: "player", password: "password123" })}>
        sign in
      </button>
      <button
        onClick={() =>
          void auth.signUp({
            username: "player",
            email: "player@example.com",
            password: "password123",
          })
        }
      >
        sign up
      </button>
      <button onClick={() => void auth.signOut()}>sign out</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getFromStorage.mockResolvedValue(null);
    mocks.removeFromStorage.mockResolvedValue(undefined);
    mocks.setToStorage.mockResolvedValue(undefined);
    mocks.getSession.mockResolvedValue({ user });
    mocks.login.mockResolvedValue({ session });
    mocks.register.mockResolvedValue({ session });
    mocks.logout.mockResolvedValue(null);
  });

  afterEach(cleanup);

  it("finishes loading when there is no stored session", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText("guest")).toBeTruthy());
    expect(mocks.getSession).not.toHaveBeenCalled();
  });

  it("refreshes and persists a stored session", async () => {
    mocks.getFromStorage.mockResolvedValueOnce(JSON.stringify(session));
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText("player")).toBeTruthy());
    expect(mocks.getSession).toHaveBeenCalledWith("https://api.example", {
      token: "session-token",
    });
    expect(mocks.setToStorage).toHaveBeenCalledOnce();
  });

  it("clears an invalid stored session", async () => {
    mocks.getFromStorage.mockResolvedValueOnce(JSON.stringify(session));
    mocks.getSession.mockRejectedValueOnce(new Error("expired"));
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(mocks.removeFromStorage).toHaveBeenCalledOnce());
    expect(screen.getByText("guest")).toBeTruthy();
  });

  it("signs in, signs up, and signs out while updating stored session", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByText("guest")).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "sign in" }));
    await waitFor(() =>
      expect(mocks.login).toHaveBeenCalledWith("https://api.example", {
        identifier: "player",
        password: "password123",
      }),
    );
    await waitFor(() => expect(mocks.setToStorage).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: "sign up" }));
    await waitFor(() =>
      expect(mocks.register).toHaveBeenCalledWith("https://api.example", {
        username: "player",
        email: "player@example.com",
        password: "password123",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "sign out" }));
    await waitFor(() =>
      expect(mocks.logout).toHaveBeenCalledWith("https://api.example", {
        token: "session-token",
      }),
    );
    await waitFor(() => expect(screen.getByText("guest")).toBeTruthy());
  });

  it("allows signing out when the session has no token", async () => {
    mocks.getFromStorage.mockResolvedValueOnce(JSON.stringify({ ...session, token: undefined }));
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByText("player")).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "sign out" }));

    await waitFor(() => expect(mocks.removeFromStorage).toHaveBeenCalled());
    expect(mocks.logout).not.toHaveBeenCalled();
  });

  it("throws when the auth hook is used outside the provider", () => {
    expect(() => renderHook(() => useAuth())).toThrow("useAuth must be used within AuthProvider");
  });
});
