import type { ReactElement } from "react";

import { FEATURE_TOGGLES } from "@belot/constants";

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

vi.mock("../src/usePointsTypeFeature", () => ({
  useSyncPointsTypeFeature: vi.fn(),
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
    useCallback: (callback: (...args: unknown[]) => unknown) => callback,
    useMemo: (factory: () => unknown) => factory(),
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
    const { FeatureToggleContext } = await import("../src/featureToggles/toggleContext");
    const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleProvider");

    const element = FeatureToggleProvider({
      children: "child",
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    }) as ReactElement<{
      value: {
        toggles: FeatureToggleState;
        setFeatureToggle: unknown;
      };
      children: string;
    }>;

    expect(element.type).toBe(FeatureToggleContext.Provider);
    expect(element.props.value.toggles).toEqual(FEATURE_TOGGLES);
    expect(element.props.value.setFeatureToggle).toEqual(expect.any(Function));
    expect(element.props.children).toEqual(expect.arrayContaining(["child"]));
  });

  it("syncs centralized toggles on mount", async () => {
    const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleProvider");

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
      expect(mocks.setToggles).toHaveBeenCalledWith(expect.any(Function));
    });

    const updateToggles = mocks.setToggles.mock.calls[0]?.[0] as (
      current: FeatureToggleState,
    ) => FeatureToggleState;
    expect(
      updateToggles({
        ...FEATURE_TOGGLES,
        "settings-screen": false,
      }),
    ).toEqual({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    });
  });

  it("persists and provides feature toggle updates", async () => {
    const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleProvider");
    const { StorageKeys } = await import("@belot/constants");
    const { serializeFeatureToggleState } =
      await import("../src/featureToggles/featureToggleUtils");

    const element = FeatureToggleProvider({
      children: "child",
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    }) as ReactElement<{
      value: {
        toggles: FeatureToggleState;
        setFeatureToggle: (name: "settings-screen", enabled: boolean) => Promise<void>;
      };
      children: string;
    }>;

    await element.props.value.setFeatureToggle("settings-screen", true);

    expect(mocks.setToggles).toHaveBeenCalledWith({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    });
    expect(mocks.setToStorage).toHaveBeenCalledWith(
      StorageKeys.featureToggles,
      serializeFeatureToggleState({
        ...FEATURE_TOGGLES,
        "settings-screen": true,
      }),
    );
  });

  it("does not update state after unmount when sync resolves late", async () => {
    let resolveSync: (value: FeatureToggleState) => void = () => undefined;
    mocks.syncFeatureTogglesToStorage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSync = resolve;
        }),
    );

    const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleProvider");

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
