import { FEATURE_TOGGLES } from "@belot/constants";

import { describe, expect, it } from "vitest";

import { FeatureToggleContext } from "../src/featureToggles/toggleContext";

describe("FeatureToggleContext", () => {
  it("exposes default toggles and a resolving noop setter", async () => {
    const ctx = FeatureToggleContext as unknown as {
      _currentValue: {
        toggles: typeof FEATURE_TOGGLES;
        setFeatureToggle: (key: string, value: boolean) => Promise<void>;
      };
    };
    expect(ctx._currentValue.toggles).toEqual(FEATURE_TOGGLES);
    await expect(
      ctx._currentValue.setFeatureToggle("settings-screen", true),
    ).resolves.toBeUndefined();
  });
});
