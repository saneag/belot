import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";

import DevToolsPage from "@/pages/dev-tools";

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: {
    status: "unlocked",
    isAuthenticated: false,
    failedAttempts: 0,
    blockedUntil: null,
    remainingBlockMs: 0,
    error: null as string | null,
    submitPassword: vi.fn<(password: string) => void>(),
  },
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

vi.mock("@/components/backButton", () => ({
  BackButton: () => <button type="button">Back</button>,
}));

describe("DevToolsPage", () => {
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

  it("asks for a password before showing feature toggles", () => {
    render(<DevToolsPage />);

    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123321" } });
    fireEvent.click(screen.getByRole("button", { name: "Unlock" }));

    expect(mocks.auth.submitPassword).toHaveBeenCalledWith("123321");
    expect(screen.queryByRole("switch")).toBeNull();
  });

  it("shows lock countdown and disables submit when locked", () => {
    mocks.auth.status = "locked";
    mocks.auth.error = "Too many incorrect attempts. Try again in 5 minutes.";
    mocks.auth.remainingBlockMs = 125_000;

    render(<DevToolsPage />);

    expect(screen.getByText("Try again in 2:05.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Unlock" })).toHaveProperty("disabled", true);
  });

  it("renders toggles and persists changes after authentication", () => {
    mocks.auth.isAuthenticated = true;
    mocks.toggles = {
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    };

    render(<DevToolsPage />);

    const settingsSwitch = screen.getByRole("switch", {
      name: "settings-screen feature toggle",
    });
    expect(settingsSwitch.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(settingsSwitch);

    expect(mocks.setFeatureToggle).toHaveBeenCalledWith("settings-screen", false);
  });
});
