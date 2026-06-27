import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  password: "secret",
  setPassword: vi.fn((value: string) => {
    mocks.password = value;
  }),
  submitPassword: vi.fn(),
  setFeatureToggle: vi.fn(),
  toggles: { "settings-screen": true },
  useDevToolsAuth: vi.fn(),
}));

vi.mock("react", () => ({
  useState: () => [mocks.password, mocks.setPassword],
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    devToolsTitle: "Dev tools",
    devToolsPasswordLabel: "Password",
    devToolsUnlockButton: "Unlock",
    devToolsFeatureToggleLabel: "Feature toggle",
    devToolsTryAgainIn: "Try again",
  }),
}));

vi.mock("@belot/utils", () => ({
  formatRemainingTime: vi.fn(() => "1:00"),
}));

vi.mock("../src/featureToggles/useFeatureToggle", () => ({
  useFeatureToggles: () => ({
    toggles: mocks.toggles,
    setFeatureToggle: mocks.setFeatureToggle,
  }),
}));

vi.mock("../src/useDevToolsAuth", () => ({
  useDevToolsAuth: (options: unknown) => {
    mocks.useDevToolsAuth(options);
    return {
      status: "locked",
      remainingBlockMs: 60_000,
      submitPassword: mocks.submitPassword,
    };
  },
}));

describe("useDevTools", () => {
  it("submits the current password and clears the input", async () => {
    const { useDevTools } = await import("../src/useDevTools");
    const getFromStorage = vi.fn();
    const setToStorage = vi.fn();

    const result = useDevTools({
      devToolsPassword: "expected-password",
      getFromStorage,
      setToStorage,
    });

    result.handleSubmit();

    expect(mocks.useDevToolsAuth).toHaveBeenCalledWith({
      devToolsPassword: "expected-password",
      getFromStorage,
      setToStorage,
    });
    expect(result.isLocked).toBe(true);
    expect(result.toggles).toEqual(mocks.toggles);
    expect(result.setFeatureToggle).toBe(mocks.setFeatureToggle);
    expect(mocks.submitPassword).toHaveBeenCalledWith("secret");
    expect(mocks.setPassword).toHaveBeenCalledWith("");
  });
});
