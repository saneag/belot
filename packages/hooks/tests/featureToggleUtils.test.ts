import { FEATURE_TOGGLES, StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  areFeatureToggleStatesEqual,
  getDefaultFeatureToggleState,
  isKnownFeatureToggle,
  logUnknownFeatureToggle,
  needsFeatureToggleStorageSync,
  parseStoredFeatureToggles,
  serializeFeatureToggleState,
  syncFeatureTogglesToStorage,
} from "../src/featureToggles/featureToggleUtils";

describe("featureToggleUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns centralized defaults", () => {
    expect(getDefaultFeatureToggleState()).toEqual(FEATURE_TOGGLES);
  });

  it("identifies known feature toggles", () => {
    expect(isKnownFeatureToggle("settings-screen")).toBe(true);
    expect(isKnownFeatureToggle("points-type")).toBe(true);
    expect(isKnownFeatureToggle("unknown-toggle")).toBe(false);
  });

  it("logs an error for unknown feature toggles", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logUnknownFeatureToggle("unknown-toggle");

    expect(errorSpy).toHaveBeenCalledWith(
      '[FeatureToggle] Unknown feature toggle "unknown-toggle". Add it to FEATURE_TOGGLES in @belot/constants. Feature will be hidden.',
    );
  });

  it("serializes feature toggles using centralized key order", () => {
    expect(serializeFeatureToggleState(FEATURE_TOGGLES)).toBe(JSON.stringify(FEATURE_TOGGLES));
  });

  it("parses only known feature toggles from storage", () => {
    expect(
      parseStoredFeatureToggles(
        JSON.stringify({
          "settings-screen": true,
          "backend-game-init": false,
          "points-type": true,
          "unknown-toggle": true,
        }),
      ),
    ).toEqual({
      "settings-screen": true,
      "backend-game-init": false,
      "points-type": true,
    });
  });

  it("detects equivalent feature toggle states", () => {
    expect(areFeatureToggleStatesEqual(FEATURE_TOGGLES, { ...FEATURE_TOGGLES })).toBe(true);
  });

  it("detects when storage is missing newly added feature toggles", () => {
    expect(
      needsFeatureToggleStorageSync(
        JSON.stringify({
          "settings-screen": true,
          "backend-game-init": false,
        }),
        FEATURE_TOGGLES,
      ),
    ).toBe(true);
  });

  it("detects when stored values differ from centralized defaults", () => {
    expect(
      needsFeatureToggleStorageSync(
        JSON.stringify({
          ...FEATURE_TOGGLES,
          "settings-screen": true,
        }),
        FEATURE_TOGGLES,
      ),
    ).toBe(true);
  });

  it("skips storage sync when all centralized toggles match storage", () => {
    expect(needsFeatureToggleStorageSync(JSON.stringify(FEATURE_TOGGLES), FEATURE_TOGGLES)).toBe(
      false,
    );
  });

  it("syncs centralized toggles to storage", async () => {
    const getFromStorage = vi.fn().mockResolvedValue(null);
    const setToStorage = vi.fn().mockResolvedValue(undefined);

    const syncedToggles = await syncFeatureTogglesToStorage({
      getFromStorage,
      setToStorage,
    });

    expect(getFromStorage).toHaveBeenCalledWith(StorageKeys.featureToggles);
    expect(setToStorage).toHaveBeenCalledWith(
      StorageKeys.featureToggles,
      serializeFeatureToggleState(FEATURE_TOGGLES),
    );
    expect(syncedToggles).toEqual(FEATURE_TOGGLES);
  });

  it("updates storage when a new centralized toggle is missing from storage", async () => {
    const getFromStorage = vi.fn().mockResolvedValue(
      JSON.stringify({
        "settings-screen": true,
        "backend-game-init": false,
      }),
    );
    const setToStorage = vi.fn().mockResolvedValue(undefined);

    const syncedToggles = await syncFeatureTogglesToStorage({
      getFromStorage,
      setToStorage,
    });

    expect(setToStorage).toHaveBeenCalledWith(
      StorageKeys.featureToggles,
      serializeFeatureToggleState(FEATURE_TOGGLES),
    );
    expect(syncedToggles).toEqual(FEATURE_TOGGLES);
  });

  it("skips storage write when centralized toggles are already synced", async () => {
    const getFromStorage = vi.fn().mockResolvedValue(serializeFeatureToggleState(FEATURE_TOGGLES));
    const setToStorage = vi.fn();

    await syncFeatureTogglesToStorage({
      getFromStorage,
      setToStorage,
    });

    expect(setToStorage).not.toHaveBeenCalled();
  });

  it("supports synchronous storage adapters", async () => {
    const getFromStorage = vi.fn().mockReturnValue(null);
    const setToStorage = vi.fn();

    const syncedToggles = await syncFeatureTogglesToStorage({
      getFromStorage,
      setToStorage,
    });

    expect(syncedToggles).toEqual(FEATURE_TOGGLES);
    expect(setToStorage).toHaveBeenCalledWith(
      StorageKeys.featureToggles,
      serializeFeatureToggleState(FEATURE_TOGGLES),
    );
  });
});
