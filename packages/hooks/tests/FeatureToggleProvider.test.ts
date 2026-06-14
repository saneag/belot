import { FEATURE_TOGGLES } from "@belot/constants";

import type { ReactElement } from "react";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FeatureToggleState } from "../src/featureToggles/featureToggleUtils";

const mocks = vi.hoisted(() => ({
  toggles: {
    "settings-screen": false,
  },
  setToggles: vi.fn(),
  syncFeatureTogglesToStorage: vi.fn(),
  getFromStorage: vi.fn(),
  setToStorage: vi.fn(),
  effectCleanups: [] as Array<(() => void) | void>,
}));

vi.mock("../src/featureToggles/featureToggleUtils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/featureToggles/featureToggleUtils")>();

  return {
    ...actual,
    syncFeatureTogglesToStorage: mocks.syncFeatureTogglesToStorage,
  };
});

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useState: () => [mocks.toggles, mocks.setToggles],
    useEffect: (effect: () => void | (() => void)) => {
      mocks.effectCleanups.push(effect());
    },
  };
});

describe("FeatureToggleProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.toggles = { ...FEATURE_TOGGLES };
    mocks.effectCleanups = [];
    mocks.syncFeatureTogglesToStorage.mockResolvedValue({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    });
  });

  it("provides default toggle state before sync completes", async () => {
    const { FeatureToggleContext, FeatureToggleProvider } = await import(
      "../src/featureToggles/FeatureToggleContext"
    );

    const element = FeatureToggleProvider({
      children: "child",
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    }) as ReactElement<{ value: FeatureToggleState; children: string }>;

    expect(element.type).toBe(FeatureToggleContext.Provider);
    expect(element.props.value).toEqual(FEATURE_TOGGLES);
    expect(element.props.children).toBe("child");
  });

  it("syncs centralized toggles on mount", async () => {
    const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleContext");

    FeatureToggleProvider({
      children: "child",
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await vi.waitFor(() => {
      expect(mocks.syncFeatureTogglesToStorage).toHaveBeenCalledWith({
        getFromStorage: mocks.getFromStorage,
        setToStorage: mocks.setToStorage,
      });
    });

    await vi.waitFor(() => {
      expect(mocks.setToggles).toHaveBeenCalledWith({
        ...FEATURE_TOGGLES,
        "settings-screen": true,
      });
    });
  });

  it("does not update state after unmount when sync resolves late", async () => {
    let resolveSync: (value: FeatureToggleState) => void = () => undefined;
    mocks.syncFeatureTogglesToStorage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSync = resolve;
        }),
    );

    const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleContext");

    FeatureToggleProvider({
      children: "child",
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    const cleanup = mocks.effectCleanups[0];
    cleanup?.();

    resolveSync({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    });
    await Promise.resolve();

    expect(mocks.setToggles).not.toHaveBeenCalled();
  });
});
