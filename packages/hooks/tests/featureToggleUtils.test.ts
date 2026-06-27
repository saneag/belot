import { FEATURE_TOGGLES, StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  areFeatureToggleStatesEqual,
  arePartialFeatureToggleStatesEqual,
  getDefaultFeatureToggleState,
  getEffectiveFeatureToggleState,
  isKnownFeatureToggle,
  logUnknownFeatureToggle,
  needsFeatureToggleStorageSync,
  parseRemoteFeatureToggles,
  parseStoredFeatureToggles,
  removeOverridesMatchingRemote,
  serializeFeatureToggleState,
  syncFeatureTogglesToStorage,
} from "../src/featureToggles/featureToggleUtils";

const remoteResponse = {
  toggles: [
    { name: "settings-screen", enabled: true },
    { name: "backend-game-init", enabled: false },
  ],
};

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

  it("serializes feature toggles using centralized key order and omits missing values", () => {
    expect(serializeFeatureToggleState(FEATURE_TOGGLES)).toBe(JSON.stringify(FEATURE_TOGGLES));
    expect(serializeFeatureToggleState({ "settings-screen": true })).toBe(
      JSON.stringify({ "settings-screen": true }),
    );
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

  it("returns null for empty, malformed, and non-object stored toggle values", () => {
    expect(parseStoredFeatureToggles(null)).toBeNull();
    expect(parseStoredFeatureToggles("not-json")).toBeNull();
    expect(parseStoredFeatureToggles("false")).toBeNull();
  });

  it("parses known toggles from remote responses", () => {
    expect(
      parseRemoteFeatureToggles({
        toggles: [
          { name: "settings-screen", enabled: true },
          { name: "missing-toggle", enabled: true },
        ],
      }),
    ).toEqual({ "settings-screen": true });
  });

  it("detects equivalent feature toggle states", () => {
    expect(areFeatureToggleStatesEqual(FEATURE_TOGGLES, { ...FEATURE_TOGGLES })).toBe(true);
    expect(
      areFeatureToggleStatesEqual(FEATURE_TOGGLES, {
        ...FEATURE_TOGGLES,
        "settings-screen": !FEATURE_TOGGLES["settings-screen"],
      }),
    ).toBe(false);
    expect(arePartialFeatureToggleStatesEqual({}, {})).toBe(true);
    expect(arePartialFeatureToggleStatesEqual({ "settings-screen": true }, {})).toBe(false);
  });

  it("detects malformed override storage", () => {
    expect(needsFeatureToggleStorageSync("not-json")).toBe(true);
    expect(needsFeatureToggleStorageSync(JSON.stringify({}))).toBe(false);
  });

  it("builds effective state from defaults, remote toggles, then local overrides", () => {
    expect(
      getEffectiveFeatureToggleState(
        { "settings-screen": true, "points-type": true },
        { "settings-screen": false },
      ),
    ).toEqual({
      ...FEATURE_TOGGLES,
      "settings-screen": false,
      "points-type": true,
    });
  });

  it("removes local overrides that match the current remote value", () => {
    expect(
      removeOverridesMatchingRemote(
        { "settings-screen": true, "points-type": true },
        { "settings-screen": true, "points-type": false },
      ),
    ).toEqual({ "points-type": true });
  });

  it("initializes from code defaults when no remote cache or overrides exist", async () => {
    const getFromStorage = vi.fn().mockResolvedValue(null);
    const setToStorage = vi.fn().mockResolvedValue(undefined);

    const synced = await syncFeatureTogglesToStorage({ getFromStorage, setToStorage });

    expect(getFromStorage).toHaveBeenCalledWith(StorageKeys.remoteFeatureToggles);
    expect(getFromStorage).toHaveBeenCalledWith(StorageKeys.featureToggles);
    expect(setToStorage).not.toHaveBeenCalled();
    expect(synced).toEqual({ toggles: FEATURE_TOGGLES, remoteToggles: {}, localOverrides: {} });
  });

  it("fetches, caches, and applies remote toggles", async () => {
    const getFromStorage = vi.fn().mockResolvedValue(null);
    const setToStorage = vi.fn().mockResolvedValue(undefined);
    const fetchRemoteFeatureToggles = vi.fn().mockResolvedValue(remoteResponse);

    const synced = await syncFeatureTogglesToStorage({
      fetchRemoteFeatureToggles,
      getFromStorage,
      setToStorage,
    });

    expect(setToStorage).toHaveBeenCalledWith(
      StorageKeys.remoteFeatureToggles,
      JSON.stringify({ "settings-screen": true, "backend-game-init": false }),
    );
    expect(synced.toggles).toEqual({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
      "backend-game-init": false,
    });
  });

  it("local overrides override remote values", async () => {
    const getFromStorage = vi.fn((key: StorageKeys) => {
      if (key === StorageKeys.remoteFeatureToggles) {
        return JSON.stringify({ "settings-screen": true });
      }
      return JSON.stringify({ "settings-screen": false });
    });
    const setToStorage = vi.fn();

    const synced = await syncFeatureTogglesToStorage({ getFromStorage, setToStorage });

    expect(synced.toggles["settings-screen"]).toBe(false);
    expect(synced.localOverrides).toEqual({ "settings-screen": false });
  });

  it("failed endpoint fetch falls back to cached remote values", async () => {
    const getFromStorage = vi.fn((key: StorageKeys) => {
      if (key === StorageKeys.remoteFeatureToggles) {
        return JSON.stringify({ "settings-screen": true });
      }
      return null;
    });
    const setToStorage = vi.fn();
    const fetchRemoteFeatureToggles = vi.fn().mockRejectedValue(new Error("offline"));

    const synced = await syncFeatureTogglesToStorage({
      fetchRemoteFeatureToggles,
      getFromStorage,
      setToStorage,
    });

    expect(synced.toggles["settings-screen"]).toBe(true);
    expect(setToStorage).not.toHaveBeenCalled();
  });

  it("prunes stored local overrides that match remote values", async () => {
    const getFromStorage = vi.fn((key: StorageKeys) => {
      if (key === StorageKeys.remoteFeatureToggles) {
        return JSON.stringify({ "settings-screen": true });
      }
      return JSON.stringify({ "settings-screen": true, "points-type": true });
    });
    const setToStorage = vi.fn();

    const synced = await syncFeatureTogglesToStorage({ getFromStorage, setToStorage });

    expect(synced.localOverrides).toEqual({ "points-type": true });
    expect(setToStorage).toHaveBeenCalledWith(
      StorageKeys.featureToggles,
      JSON.stringify({ "points-type": true }),
    );
  });
});
