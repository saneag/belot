import { POINTS_TYPE } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  storePointsType: "micropoints",
  setPointsType: vi.fn(),
  isPointsTypeEnabled: false,
}));

vi.mock("react", () => ({
  useEffect: (effect: () => void) => {
    effect();
  },
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      pointsType: mocks.storePointsType,
      setPointsType: mocks.setPointsType,
    }),
}));

vi.mock("../src/featureToggles/useFeatureToggle", () => ({
  useFeatureToggle: (name: string) =>
    name === "points-type" ? mocks.isPointsTypeEnabled : false,
}));

describe("usePointsTypeFeature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.storePointsType = POINTS_TYPE[0].id;
    mocks.isPointsTypeEnabled = false;
  });

  it("returns micropoints when points type feature is disabled", async () => {
    mocks.storePointsType = POINTS_TYPE[1].id;
    mocks.isPointsTypeEnabled = false;

    const { useEffectivePointsType } = await import("../src/usePointsTypeFeature");

    expect(useEffectivePointsType()).toBe(POINTS_TYPE[0].id);
  });

  it("returns store points type when feature is enabled", async () => {
    mocks.storePointsType = POINTS_TYPE[1].id;
    mocks.isPointsTypeEnabled = true;

    const { useEffectivePointsType } = await import("../src/usePointsTypeFeature");

    expect(useEffectivePointsType()).toBe(POINTS_TYPE[1].id);
  });

  it("resets store to micropoints when feature is disabled", async () => {
    mocks.storePointsType = POINTS_TYPE[1].id;
    mocks.isPointsTypeEnabled = false;

    const { useSyncPointsTypeFeature } = await import("../src/usePointsTypeFeature");

    useSyncPointsTypeFeature();

    expect(mocks.setPointsType).toHaveBeenCalledWith(POINTS_TYPE[0].id);
  });

  it("does not reset store when points type is already micropoints", async () => {
    mocks.storePointsType = POINTS_TYPE[0].id;
    mocks.isPointsTypeEnabled = false;

    const { useSyncPointsTypeFeature } = await import("../src/usePointsTypeFeature");

    useSyncPointsTypeFeature();

    expect(mocks.setPointsType).not.toHaveBeenCalled();
  });
});
