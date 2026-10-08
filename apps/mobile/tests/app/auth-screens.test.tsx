import React from "react";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => React.createElement("a", null, children),
  useRouter: () => ({ replace: mocks.replace }),
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

vi.mock("@/auth/authContext", () => ({
  useAuth: () => ({ signIn: mocks.signIn, signUp: mocks.signUp }),
}));

vi.mock("react-native", () => ({
  TextInput: ({ onChangeText, ...props }: Record<string, unknown>) =>
    React.createElement("input", {
      ...props,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof onChangeText === "function") onChangeText(event.target.value);
      },
    }),
  View: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
}));

vi.mock("@/components/backButton", () => ({ BackButton: () => React.createElement("button") }));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) =>
    React.createElement("button", { onClick: onPress }, children),
  ButtonText: ({ children }: { children: React.ReactNode }) =>
    React.createElement("span", null, children),
}));
vi.mock("@/components/ui/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) =>
    React.createElement("span", null, children),
}));
vi.mock("@/components/ui/vstack", () => ({
  VStack: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
}));

describe("mobile auth screens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signIn.mockResolvedValue(undefined);
    mocks.signUp.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  it("submits login credentials and navigates after success", async () => {
    const { default: LoginScreen } = await import("@/app/login");
    render(<LoginScreen />);

    fireEvent.change(screen.getByPlaceholderText("auth.identifier.placeholder"), {
      target: { value: "player" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.password.placeholder"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "login" }));

    await waitFor(() =>
      expect(mocks.signIn).toHaveBeenCalledWith({
        identifier: "player",
        password: "password123",
      }),
    );
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/starting-screen"));
  });

  it("shows a localized error when login fails", async () => {
    mocks.signIn.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { default: LoginScreen } = await import("@/app/login");
    render(<LoginScreen />);

    fireEvent.click(screen.getByRole("button", { name: "login" }));

    expect(await screen.findByText("auth.error.invalid.credentials")).toBeTruthy();
  });

  it("submits registration details and navigates after success", async () => {
    const { default: RegisterScreen } = await import("@/app/register");
    render(<RegisterScreen />);

    fireEvent.change(screen.getByPlaceholderText("auth.username.placeholder"), {
      target: { value: "player" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.email.placeholder"), {
      target: { value: "player@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.password.placeholder"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "auth.register" }));

    await waitFor(() =>
      expect(mocks.signUp).toHaveBeenCalledWith({
        username: "player",
        email: "player@example.com",
        password: "password123",
      }),
    );
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/starting-screen"));
  });

  it("shows a localized error when registration fails", async () => {
    mocks.signUp.mockRejectedValueOnce(new Error("Email is invalid"));
    const { default: RegisterScreen } = await import("@/app/register");
    render(<RegisterScreen />);

    fireEvent.click(screen.getByRole("button", { name: "auth.register" }));

    expect(await screen.findByText("auth.error.invalid.credentials")).toBeTruthy();
  });
});
