import { StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  navigateFunction: vi.fn(),
  setItemsToStorage: vi.fn(),
  resetGame: vi.fn(),
  showDialog: false,
  setShowDialog: vi.fn(),
}));

vi.mock("react", () => ({
  useCallback: (callback: () => unknown) => callback,
  useState: () => [mocks.showDialog, mocks.setShowDialog],
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) => selector({ reset: mocks.resetGame }),
}));

describe("useHandleGameReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.setItemsToStorage.mockResolvedValue(undefined);
  });

  it("clears storage, resets game, and navigates", async () => {
    const { useHandleGameReset } = await import("../src/useHandleGameReset");

    const { handleReset } = useHandleGameReset({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
    });

    await handleReset();

    expect(mocks.setItemsToStorage).toHaveBeenCalledWith({
      [StorageKeys.timerStartTime]: "",
      [StorageKeys.roundsScores]: JSON.stringify([]),
      [StorageKeys.dealer]: "",
    });
    expect(mocks.resetGame).toHaveBeenCalledOnce();
    expect(mocks.navigateFunction).toHaveBeenCalledOnce();
  });
});
