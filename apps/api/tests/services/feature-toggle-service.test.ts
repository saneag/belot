import { FEATURE_TOGGLES } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { FeatureToggleService } from "../../services/feature-toggle-service";

const mocks = vi.hoisted(() => ({
  find: vi.fn(),
  findOneAndUpdate: vi.fn(),
}));

vi.mock("../../schemas/feature-toggle-schema", () => ({
  default: {
    find: mocks.find,
    findOneAndUpdate: mocks.findOneAndUpdate,
  },
}));

const doc = (name: string, enabled: boolean) => ({
  toJSON: () => ({ name, enabled }),
});

describe("FeatureToggleService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists canonical toggles with stored values overriding defaults", async () => {
    mocks.find.mockResolvedValue([doc("settings-screen", true)]);

    await expect(FeatureToggleService.listFeatureToggles()).resolves.toEqual([
      { name: "settings-screen", enabled: true },
      { name: "backend-game-init", enabled: FEATURE_TOGGLES["backend-game-init"] },
      { name: "points-type", enabled: FEATURE_TOGGLES["points-type"] },
      { name: "max-score-selector", enabled: FEATURE_TOGGLES["max-score-selector"] },
    ]);

    expect(mocks.find).toHaveBeenCalledWith({ name: { $in: Object.keys(FEATURE_TOGGLES) } });
  });

  it("upserts known toggle values", async () => {
    mocks.findOneAndUpdate.mockResolvedValue(doc("settings-screen", true));

    await expect(FeatureToggleService.setFeatureToggle("settings-screen", true)).resolves.toEqual({
      name: "settings-screen",
      enabled: true,
    });

    expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
      { name: "settings-screen" },
      { $set: { enabled: true } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  });
});
