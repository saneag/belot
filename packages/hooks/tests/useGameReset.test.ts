import { StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  navigateFunction: vi.fn(),
  removeItemsFromStorage: vi.fn(),
  resetGame: vi.fn(),
}));

vi.mock("react", () => ({
  useCallback: (callback: () => unknown) => callback,
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) => selector({ reset: mocks.resetGame }),
}));

describe("useGameReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.removeItemsFromStorage.mockResolvedValue(undefined);
  });

  it("removes all game reset storage keys, navigates, then resets store", async () => {
    const { useGameReset, GAME_RESET_STORAGE_KEYS } = await import("../src/useGameReset");

    const callOrder: string[] = [];
    mocks.navigateFunction.mockImplementation(() => callOrder.push("navigate"));
    mocks.resetGame.mockImplementation(() => callOrder.push("reset"));

    const { handleReset } = useGameReset({
      navigateFunction: mocks.navigateFunction,
      removeItemsFromStorage: mocks.removeItemsFromStorage,
    });

    await handleReset();

    expect(mocks.removeItemsFromStorage).toHaveBeenCalledWith([...GAME_RESET_STORAGE_KEYS]);
    expect(mocks.removeItemsFromStorage).toHaveBeenCalledWith(
      expect.arrayContaining([
        StorageKeys.dealer,
        StorageKeys.roundsScores,
        StorageKeys.timerStartTime,
        StorageKeys.maxScore,
      ]),
    );
    expect(mocks.navigateFunction).toHaveBeenCalledOnce();
    expect(mocks.resetGame).toHaveBeenCalledOnce();
    expect(callOrder).toEqual(["navigate", "reset"]);
  });

  it("calls afterNavigate instead of resetStore when provided", async () => {
    const { useGameReset } = await import("../src/useGameReset");

    const afterNavigate = vi.fn();

    const { handleReset } = useGameReset({
      navigateFunction: mocks.navigateFunction,
      removeItemsFromStorage: mocks.removeItemsFromStorage,
      afterNavigate,
    });

    await handleReset();

    expect(afterNavigate).toHaveBeenCalledOnce();
    expect(mocks.resetGame).not.toHaveBeenCalled();
  });

  it("calls onComplete after navigate and reset", async () => {
    const { useGameReset } = await import("../src/useGameReset");

    const callOrder: string[] = [];
    mocks.navigateFunction.mockImplementation(() => callOrder.push("navigate"));
    mocks.resetGame.mockImplementation(() => callOrder.push("reset"));
    const onComplete = vi.fn(() => callOrder.push("complete"));

    const { handleReset } = useGameReset({
      navigateFunction: mocks.navigateFunction,
      removeItemsFromStorage: mocks.removeItemsFromStorage,
      onComplete,
    });

    await handleReset();

    expect(onComplete).toHaveBeenCalledOnce();
    expect(callOrder).toEqual(["navigate", "reset", "complete"]);
  });
});
