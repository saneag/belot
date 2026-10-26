import { AuthProvider } from "@/auth/authContext";
import { useAuth } from "@/auth/useAuth";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  getApiBaseUrl: vi.fn(() => "https://api.example"),
}));

vi.mock("@belot/api-client", () => ({
  getSession: mocks.getSession,
  login: mocks.login,
  logout: mocks.logout,
  register: mocks.register,
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

describe("web AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({ user });
    mocks.login.mockResolvedValue({ session });
    mocks.register.mockResolvedValue({ session });
    mocks.logout.mockResolvedValue(null);
  });

  afterEach(cleanup);

  it("loads a user from the current session", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(await screen.findByText("player")).toBeTruthy();
    expect(mocks.getSession).toHaveBeenCalledWith("https://api.example");
  });

  it("finishes loading when session lookup fails", async () => {
    mocks.getSession.mockRejectedValueOnce(new Error("no session"));
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(await screen.findByText("guest")).toBeTruthy();
  });

  it("supports sign in, sign up, and sign out", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    await screen.findByText("player");

    fireEvent.click(screen.getByRole("button", { name: "sign in" }));
    await waitFor(() =>
      expect(mocks.login).toHaveBeenCalledWith("https://api.example", {
        identifier: "player",
        password: "password123",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "sign up" }));
    await waitFor(() =>
      expect(mocks.register).toHaveBeenCalledWith("https://api.example", {
        username: "player",
        email: "player@example.com",
        password: "password123",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "sign out" }));
    await waitFor(() => expect(mocks.logout).toHaveBeenCalledWith("https://api.example"));
    expect(await screen.findByText("guest")).toBeTruthy();
  });
});
