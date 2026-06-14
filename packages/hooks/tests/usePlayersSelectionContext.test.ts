import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

vi.mock("react", () => ({
  createContext: (defaultValue: unknown) => ({ defaultValue }),
  useContext: mocks.useContext,
}));

describe("usePlayersSelectionContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns context value from provider", async () => {
    const contextValue = {
      validations: { emptyNames: [1], repeatingNames: [] },
      setValidations: vi.fn(),
      resetValidations: vi.fn(),
    };
    mocks.useContext.mockReturnValue(contextValue);

    const { usePlayersSelectionContext } = await import("../src/usePlayersSelectionContext");
    expect(usePlayersSelectionContext()).toBe(contextValue);
  });

  it("throws when used outside provider", async () => {
    mocks.useContext.mockReturnValue(undefined);

    const { usePlayersSelectionContext } = await import("../src/usePlayersSelectionContext");
    expect(() => usePlayersSelectionContext()).toThrow(
      "usePlayersSelectionContext must be used within a PlayersSelectionContextProvider",
    );
  });

  it("exposes default noop validation handlers from context default", async () => {
    mocks.useContext.mockImplementation((context: { defaultValue: unknown }) => context.defaultValue);

    const module = await import("../src/usePlayersSelectionContext");
    const contextValue = module.usePlayersSelectionContext();

    contextValue.setValidations({ emptyNames: [], repeatingNames: [] });
    contextValue.resetValidations();
    expect(contextValue.validations).toEqual({ emptyNames: [], repeatingNames: [] });
  });
});
