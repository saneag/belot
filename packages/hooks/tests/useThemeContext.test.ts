import { THEMES } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

vi.mock("react", () => ({
  createContext: (defaultValue: unknown) => ({ defaultValue }),
  useContext: mocks.useContext,
}));

describe("useThemeContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns theme context value", async () => {
    const contextValue = {
      theme: THEMES.light,
      setTheme: vi.fn(),
      initialTheme: THEMES.light,
    };
    mocks.useContext.mockReturnValue(contextValue);

    const { useThemeContext } = await import("../src/useThemeContext");
    expect(useThemeContext()).toBe(contextValue);
  });

  it("throws when used outside provider", async () => {
    mocks.useContext.mockReturnValue(undefined);

    const { useThemeContext } = await import("../src/useThemeContext");
    expect(() => useThemeContext()).toThrow(
      "useThemeContext must be used within a ThemeContextProvider",
    );
  });
});
