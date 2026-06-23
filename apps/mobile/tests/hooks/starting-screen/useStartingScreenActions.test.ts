import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  gameData: {
    storagePlayers: null,
    storageDealer: null,
    storageRoundsScores: null,
  },
  startingScreenActions: [
    { index: 0, label: "New game", isActive: true, onPress: vi.fn() },
    { index: 1, label: "Settings", isActive: true, onPress: vi.fn() },
  ],
  navigateArgs: null as { navigate: (path: string) => void } | null,
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ push: mocks.push, replace: vi.fn(), back: vi.fn() }),
}));

vi.mock("@belot/hooks", () => ({
  useLoadGameData: () => mocks.gameData,
  useStartingScreenActionsHelper: (args: { navigate: (path: string) => void }) => {
    mocks.navigateArgs = args;
    return mocks.startingScreenActions;
  },
}));

vi.mock("@/helpers/storageHelpers", () => ({
  getFromStorage: vi.fn(),
  removeFromStorage: vi.fn(),
  setToStorage: vi.fn(),
}));

describe("useStartingScreenActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns actions from helper", async () => {
    const { useStartingScreenActions } =
      await import("@/hooks/starting-screen/useStartingScreenActions");

    const actions = useStartingScreenActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].label).toBe("New game");
  });

  it("navigates to game-table path", async () => {
    const { useStartingScreenActions } =
      await import("@/hooks/starting-screen/useStartingScreenActions");
    useStartingScreenActions();

    mocks.navigateArgs?.navigate("game-table");
    expect(mocks.push).toHaveBeenCalledWith("/game-table");
  });

  it("navigates to players-selection path", async () => {
    const { useStartingScreenActions } =
      await import("@/hooks/starting-screen/useStartingScreenActions");
    useStartingScreenActions();

    mocks.navigateArgs?.navigate("players-selection");
    expect(mocks.push).toHaveBeenCalledWith("/players-selection");
  });

  it("navigates to settings path", async () => {
    const { useStartingScreenActions } =
      await import("@/hooks/starting-screen/useStartingScreenActions");
    useStartingScreenActions();

    mocks.navigateArgs?.navigate("settings");
    expect(mocks.push).toHaveBeenCalledWith("/settings-screen");
  });

  it("throws for unknown navigation path", async () => {
    const { useStartingScreenActions } =
      await import("@/hooks/starting-screen/useStartingScreenActions");
    useStartingScreenActions();

    expect(() => mocks.navigateArgs?.navigate("unknown")).toThrow("Unknown navigation path");
  });
});
