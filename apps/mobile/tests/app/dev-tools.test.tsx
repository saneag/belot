import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

interface AuthMock {
  status: string;
  isAuthenticated: boolean;
  failedAttempts: number;
  blockedUntil: number | null;
  remainingBlockMs: number;
  error: string | null;
  submitPassword: Mock<(password: string) => void>;
}

const mocks = vi.hoisted(() => ({
  auth: {
    status: "unlocked",
    isAuthenticated: false,
    failedAttempts: 0,
    blockedUntil: null,
    remainingBlockMs: 0,
    error: null as string | null,
    submitPassword: vi.fn<(password: string) => void>(),
  } as AuthMock,
  password: "123321",
  toggles: {} as Record<FeatureToggleName, boolean>,
  setPassword: vi.fn(),
  setFeatureToggle: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useDevTools: () => ({
    auth: mocks.auth,
    handleSubmit: () => {
      mocks.auth.submitPassword(mocks.password);
      mocks.setPassword("");
    },
    isLocked: mocks.auth.status === "locked",
    messages: {
      devToolsFeatureToggleLabel: "{0} feature toggle",
      devToolsPasswordLabel: "Password",
      devToolsTitle: "Dev tools",
      devToolsTryAgainIn: "Try again in 2:05.",
      devToolsUnlockButton: "Unlock",
    },
    password: mocks.password,
    setPassword: mocks.setPassword,
    toggles: mocks.toggles,
    setFeatureToggle: mocks.setFeatureToggle,
  }),
}));

vi.mock("@belot/localizations", () => ({
  formatLocalizationString: (localization: string, args: string[] = []) =>
    localization.replace(/{(\d+)}/g, (match, index: number) => args[index] ?? match),
}));

describe("DevToolsScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth = {
      status: "unlocked",
      isAuthenticated: false,
      failedAttempts: 0,
      blockedUntil: null,
      remainingBlockMs: 0,
      error: null,
      submitPassword: vi.fn<(password: string) => void>(),
    };
    mocks.password = "123321";
    mocks.toggles = { ...FEATURE_TOGGLES };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("asks for a password before showing feature toggles", async () => {
    const { default: DevToolsScreen } = await import("@/app/dev-tools");
    const { container } = render(<DevToolsScreen />);

    const passwordInput = container.querySelector("input");
    expect(passwordInput).toBeTruthy();

    fireEvent.change(passwordInput!, { target: { value: "123321" } });
    fireEvent.click(screen.getByRole("button", { name: "Unlock" }));

    expect(mocks.auth.submitPassword).toHaveBeenCalledWith("123321");
    expect(screen.queryByRole("switch")).toBeNull();
  });

  it("shows lock countdown and disables submit when locked", async () => {
    mocks.auth.status = "locked";
    mocks.auth.error = "Too many incorrect attempts. Try again in 5 minutes.";
    mocks.auth.remainingBlockMs = 125_000;

    const { default: DevToolsScreen } = await import("@/app/dev-tools");
    render(<DevToolsScreen />);

    expect(screen.getByText("Try again in 2:05.")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Unlock" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("renders toggles and persists changes after authentication", async () => {
    mocks.auth.isAuthenticated = true;
    mocks.toggles = {
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    };

    const { default: DevToolsScreen } = await import("@/app/dev-tools");
    render(<DevToolsScreen />);

    const settingsSwitch = screen.getByRole("switch", {
      name: "settings-screen feature toggle",
    }) as HTMLInputElement;
    expect(settingsSwitch.checked).toBe(true);

    fireEvent.click(settingsSwitch);

    expect(mocks.setFeatureToggle).toHaveBeenCalledWith("settings-screen", false);
  });
});
