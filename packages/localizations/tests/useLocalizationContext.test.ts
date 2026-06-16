import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

vi.mock("react", () => ({
  createContext: (defaultValue: unknown) => ({ defaultValue }),
  useContext: mocks.useContext,
}));

describe("useLocalizationContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns context value from provider", async () => {
    const contextValue = { getDeviceLanguage: () => "ro" };
    mocks.useContext.mockReturnValue(contextValue);

    const { useLocalizationContext } = await import("../src/hooks/useLocalizationContext");
    expect(useLocalizationContext()).toBe(contextValue);
  });

  it("throws when used outside provider", async () => {
    mocks.useContext.mockReturnValue(undefined);

    const { useLocalizationContext } = await import("../src/hooks/useLocalizationContext");
    expect(() => useLocalizationContext()).toThrow(
      "useLocalizationContext must be used within a LocalizationContextProvider",
    );
  });

  it("exposes default getDeviceLanguage handler", async () => {
    mocks.useContext.mockImplementation(
      (context: { defaultValue: unknown }) => context.defaultValue,
    );

    const { useLocalizationContext } = await import("../src/hooks/useLocalizationContext");
    expect(useLocalizationContext().getDeviceLanguage()).toBe("en");
  });
});
