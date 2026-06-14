import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resetValidations: vi.fn(),
  resetGameStore: vi.fn(),
}));

vi.mock("react", () => ({
  useCallback: (callback: () => void) => callback,
}));

vi.mock("../src/usePlayersSelectionContext", () => ({
  usePlayersSelectionContext: () => ({
    resetValidations: mocks.resetValidations,
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({ reset: mocks.resetGameStore }),
}));

describe("useHandlePlayersSelectionResetButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resets game store and validations", async () => {
    const { useHandlePlayersSelectionResetButton } = await import(
      "../src/useHandlePlayersSelectionReset"
    );

    const handleReset = useHandlePlayersSelectionResetButton();
    handleReset();

    expect(mocks.resetGameStore).toHaveBeenCalledOnce();
    expect(mocks.resetValidations).toHaveBeenCalledOnce();
  });
});
