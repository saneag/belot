import { FEATURE_TOGGLES, StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getDefaultFeatureToggleState,
  isKnownFeatureToggle,
  logUnknownFeatureToggle,
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
    expect(isKnownFeatureToggle("unknown-toggle")).toBe(false);
  });

  it("logs an error for unknown feature toggles", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logUnknownFeatureToggle("unknown-toggle");

    expect(errorSpy).toHaveBeenCalledWith(
      '[FeatureToggle] Unknown feature toggle "unknown-toggle". Add it to FEATURE_TOGGLES in @belot/constants. Feature will be hidden.',
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
      JSON.stringify(FEATURE_TOGGLES),
    );
    expect(syncedToggles).toEqual(FEATURE_TOGGLES);
  });

  it("skips storage write when centralized toggles are already synced", async () => {
    const getFromStorage = vi
      .fn()
      .mockResolvedValue(JSON.stringify(FEATURE_TOGGLES));
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
      JSON.stringify(FEATURE_TOGGLES),
    );
  });
});
