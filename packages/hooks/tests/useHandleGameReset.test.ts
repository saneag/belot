import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  navigateFunction: vi.fn(),
  removeItemsFromStorage: vi.fn(),
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
    mocks.removeItemsFromStorage.mockResolvedValue(undefined);
  });

  it("delegates reset to useGameReset and exposes dialog state", async () => {
    const { useHandleGameReset } = await import("../src/useHandleGameReset");

    const { handleReset, showDialog, setShowDialog } = useHandleGameReset({
      navigateFunction: mocks.navigateFunction,
      removeItemsFromStorage: mocks.removeItemsFromStorage,
    });

    await handleReset();

    expect(mocks.removeItemsFromStorage).toHaveBeenCalledOnce();
    expect(mocks.navigateFunction).toHaveBeenCalledOnce();
    expect(mocks.resetGame).toHaveBeenCalledOnce();
    expect(showDialog).toBe(false);
    expect(setShowDialog).toBe(mocks.setShowDialog);
  });

  it("calls afterNavigate instead of resetting directly when provided", async () => {
    const { useHandleGameReset } = await import("../src/useHandleGameReset");

    const afterNavigate = vi.fn();

    const { handleReset } = useHandleGameReset({
      navigateFunction: mocks.navigateFunction,
      removeItemsFromStorage: mocks.removeItemsFromStorage,
      afterNavigate,
    });

    await handleReset();

    expect(mocks.navigateFunction).toHaveBeenCalledOnce();
    expect(afterNavigate).toHaveBeenCalledOnce();
    expect(mocks.resetGame).not.toHaveBeenCalled();
  });
});
