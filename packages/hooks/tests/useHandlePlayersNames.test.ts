import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  validations: { emptyNames: [] as string[], repeatingNames: [] as string[] },
  resetValidations: vi.fn(),
  updatePlayer: vi.fn(),
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
}));

vi.mock("../src/usePlayersSelectionContext", () => ({
  usePlayersSelectionContext: () => ({
    validations: mocks.validations,
    resetValidations: mocks.resetValidations,
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({ updatePlayer: mocks.updatePlayer }),
}));

describe("useHandlePlayersNames", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.validations = { emptyNames: [], repeatingNames: [] };
  });

  it("marks player as invalid when validations include player id", async () => {
    mocks.validations = { emptyNames: ["1"], repeatingNames: [] };
    const player = { id: 1, name: "" };

    const { useHandlePlayersNames } = await import("../src/useHandlePlayersNames");
    const { isInvalid } = useHandlePlayersNames({ player });

    expect(isInvalid).toBe(true);
  });

  it("updates player name and resets validations", async () => {
    const player = { id: 0, name: "A" };

    const { useHandlePlayersNames } = await import("../src/useHandlePlayersNames");
    const { handlePlayerNameChange } = useHandlePlayersNames({ player });

    handlePlayerNameChange("Alice");

    expect(mocks.updatePlayer).toHaveBeenCalledWith(0, { name: "Alice" });
    expect(mocks.resetValidations).toHaveBeenCalledOnce();
  });
});
