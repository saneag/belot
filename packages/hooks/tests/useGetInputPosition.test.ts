import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  validations: { emptyNames: ["1"], repeatingNames: [] },
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
}));

vi.mock("../src/usePlayersSelectionContext", () => ({
  usePlayersSelectionContext: () => ({
    validations: mocks.validations,
  }),
}));

vi.mock("@belot/utils", () => ({
  getTopPosition: vi.fn(() => "top"),
  getRightPosition: vi.fn(() => "right"),
  getRotation: vi.fn(() => 90),
  isPlayerNameValid: vi.fn((validations: { emptyNames: string[] }, index: number) => {
    return !validations.emptyNames.includes(String(index));
  }),
}));

describe("useGetInputPosition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.validations = { emptyNames: ["1"], repeatingNames: [] };
  });

  it("delegates position helpers with validation state", async () => {
    const utils = await import("@belot/utils");
    const { useGetInputPosition } = await import("../src/useGetInputPosition");
    const { getTopPosition, getRightPosition, getRotation } = useGetInputPosition({
      topPosition: 5,
    });

    expect(getTopPosition(1, 4)).toBe("top");
    expect(getRightPosition(1, 4)).toBe("right");
    expect(getRotation(2, 4, true)).toBe(90);

    expect(utils.getTopPosition).toHaveBeenCalledWith({
      index: 1,
      playersCount: 4,
      isError: true,
      topPosition: 5,
    });
    expect(utils.getRightPosition).toHaveBeenCalledWith({
      index: 1,
      playersCount: 4,
      isError: true,
      topPosition: 5,
    });
    expect(utils.getRotation).toHaveBeenCalledWith({
      index: 2,
      playersCount: 4,
      isObjectRotation: true,
    });
  });
});
