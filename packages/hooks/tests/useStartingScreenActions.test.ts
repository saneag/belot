import { StorageKeys } from "@belot/constants";
import type { Player, RoundScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  reset: vi.fn(),
  removeFromStorage: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("react", () => ({
  useMemo: (factory: () => unknown) => factory(),
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    continueLastGame: "Continue",
    newGame: "New game",
    settings: "Settings",
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) => selector({ reset: mocks.reset }),
}));

vi.mock("../src/featureToggles/useFeatureToggle", () => ({
  useFeatureToggle: vi.fn(() => true),
}));

describe("useStartingScreenActionsHelper", () => {
  const players: Player[] = [{ id: 0, name: "A" }];
  const dealer: Player = players[0];
  const roundsScores: RoundScore[] = [
    {
      id: 0,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 162,
      roundPlayer: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes continue action when unfinished game exists", async () => {
    const { useStartingScreenActionsHelper } = await import("../src/useStartingScreenActions");
    const actions = useStartingScreenActionsHelper({
      storagePlayers: players,
      storageDealer: dealer,
      storageRoundsScores: roundsScores,
      removeFromStorage: mocks.removeFromStorage,
      navigate: mocks.navigate,
    });

    expect(actions).toHaveLength(3);
    expect(actions[0].label).toBe("Continue");
    expect(actions[0].isActive).toBe(true);

    actions[0].onPress();
    expect(mocks.navigate).toHaveBeenCalledWith("game-table");
  });

  it("omits continue action when saved game is incomplete", async () => {
    const { useStartingScreenActionsHelper } = await import("../src/useStartingScreenActions");
    const actions = useStartingScreenActionsHelper({
      storagePlayers: players,
      storageDealer: null,
      storageRoundsScores: roundsScores,
      removeFromStorage: mocks.removeFromStorage,
      navigate: mocks.navigate,
    });

    expect(actions).toHaveLength(2);
    expect(actions.some((action) => action.label === "Continue")).toBe(false);
  });

  it("starts a new game and clears saved state", async () => {
    const { useStartingScreenActionsHelper } = await import("../src/useStartingScreenActions");
    const actions = useStartingScreenActionsHelper({
      storagePlayers: null,
      storageDealer: null,
      storageRoundsScores: null,
      removeFromStorage: mocks.removeFromStorage,
      navigate: mocks.navigate,
    });

    const newGameAction = actions.find((action) => action.label === "New game");
    expect(newGameAction).toBeDefined();
    newGameAction?.onPress();

    expect(mocks.removeFromStorage).toHaveBeenCalledWith(StorageKeys.timerStartTime);
    expect(mocks.removeFromStorage).toHaveBeenCalledWith(StorageKeys.dealer);
    expect(mocks.removeFromStorage).toHaveBeenCalledWith(StorageKeys.roundsScores);
    expect(mocks.reset).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith("players-selection");
  });

  it("navigates to settings", async () => {
    const { useStartingScreenActionsHelper } = await import("../src/useStartingScreenActions");
    const actions = useStartingScreenActionsHelper({
      storagePlayers: null,
      storageDealer: null,
      storageRoundsScores: null,
      removeFromStorage: mocks.removeFromStorage,
      navigate: mocks.navigate,
    });

    const settingsAction = actions.find((action) => action.label === "Settings");
    settingsAction?.onPress();

    expect(mocks.navigate).toHaveBeenCalledWith("settings");
  });

  it("omits settings action when settings-screen toggle is disabled", async () => {
    const { useFeatureToggle } = await import("../src/featureToggles/useFeatureToggle");
    vi.mocked(useFeatureToggle).mockReturnValueOnce(false);

    const { useStartingScreenActionsHelper } = await import("../src/useStartingScreenActions");
    const actions = useStartingScreenActionsHelper({
      storagePlayers: null,
      storageDealer: null,
      storageRoundsScores: null,
      removeFromStorage: mocks.removeFromStorage,
      navigate: mocks.navigate,
    });

    expect(actions.some((action) => action.label === "Settings")).toBe(false);
  });
});
