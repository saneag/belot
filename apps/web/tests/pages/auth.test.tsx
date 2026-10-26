import { MemoryRouter, Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/auth";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ signIn: vi.fn(), signUp: vi.fn() }));

vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({ signIn: mocks.signIn, signUp: mocks.signUp }),
}));

vi.mock("@belot/localizations", () => ({
  formatLocalizationKey: (key: string) =>
    key
      .split(".")
      .map((part, index) => (index === 0 ? part : part[0]?.toUpperCase() + part.slice(1)))
      .join(""),
  getAuthErrorLocalizationKey: () => "auth.error.invalid.credentials",
  useLocalizations: (items: { key: string }[]) =>
    Object.fromEntries(
      items.map(({ key }) => [
        key
          .split(".")
          .map((part, index) => (index === 0 ? part : part[0]?.toUpperCase() + part.slice(1)))
          .join(""),
        key,
      ]),
    ),
}));

vi.mock("@/components/_layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/backButton", () => ({ BackButton: () => <button>Back</button> }));
vi.mock("@/components/phoneScreen", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function renderAuth(mode: "login" | "register", from?: string) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/auth", state: from ? { from } : null }]}>
      <Routes>
        <Route path="/auth" element={<AuthPage mode={mode} />} />
        <Route path="*" element={<div>destination</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signIn.mockResolvedValue(undefined);
    mocks.signUp.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  it("logs in and returns to the requested page", async () => {
    renderAuth("login", "/settings");

    fireEvent.change(screen.getByLabelText("auth.identifier.label"), {
      target: { value: "player" },
    });
    fireEvent.change(screen.getByLabelText("auth.password.label"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "login" }).closest("form")!);

    await waitFor(() =>
      expect(mocks.signIn).toHaveBeenCalledWith({
        identifier: "player",
        password: "password123",
      }),
    );
    expect(await screen.findByText("destination")).toBeTruthy();
  });

  it("shows login errors and links to registration", async () => {
    mocks.signIn.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderAuth("login");

    expect(screen.getByRole("link", { name: "auth.need.account" }).getAttribute("href")).toBe(
      "/register",
    );
    fireEvent.submit(screen.getByRole("button", { name: "login" }).closest("form")!);

    expect(await screen.findByText("auth.error.invalid.credentials")).toBeTruthy();
  });

  it("registers and navigates to the home page by default", async () => {
    renderAuth("register");

    fireEvent.change(screen.getByLabelText("auth.username.label"), {
      target: { value: "player" },
    });
    fireEvent.change(screen.getByLabelText("auth.email.label"), {
      target: { value: "player@example.com" },
    });
    fireEvent.change(screen.getByLabelText("auth.password.label"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "auth.register" }).closest("form")!);

    await waitFor(() =>
      expect(mocks.signUp).toHaveBeenCalledWith({
        username: "player",
        email: "player@example.com",
        password: "password123",
      }),
    );
    expect(await screen.findByText("destination")).toBeTruthy();
  });

  it("shows registration errors and links to login", async () => {
    mocks.signUp.mockRejectedValueOnce(new Error("Email is invalid"));
    renderAuth("register");

    expect(
      screen.getByRole("link", { name: "auth.already.have.account" }).getAttribute("href"),
    ).toBe("/login");
    fireEvent.submit(screen.getByRole("button", { name: "auth.register" }).closest("form")!);

    expect(await screen.findByText("auth.error.invalid.credentials")).toBeTruthy();
  });
});
