import { FEATURE_TOGGLES } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toggles: {
    "settings-screen": false,
  },
}));

vi.mock("../src/featureToggles/toggleContext", () => ({
  FeatureToggleContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useContext: () => mocks.toggles,
  };
});

describe("useFeatureToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.toggles = { ...FEATURE_TOGGLES };
  });

  it("returns enabled state from context", async () => {
    mocks.toggles = {
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    };

    const { useFeatureToggle } = await import("../src/featureToggles/useFeatureToggle");

    expect(useFeatureToggle("settings-screen")).toBe(true);
  });

  it("returns false and logs when toggle is missing from centralized config", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { useFeatureToggle } = await import("../src/featureToggles/useFeatureToggle");

    expect(useFeatureToggle("missing-toggle")).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      '[FeatureToggle] Unknown feature toggle "missing-toggle". Add it to FEATURE_TOGGLES in @belot/constants. Feature will be hidden.',
    );
  });

  it("returns false when toggle is disabled in context", async () => {
    mocks.toggles = {
      ...FEATURE_TOGGLES,
      "settings-screen": false,
    };

    const { useFeatureToggle } = await import("../src/featureToggles/useFeatureToggle");

    expect(useFeatureToggle("settings-screen")).toBe(false);
  });
});
