import type { ReactElement } from "react";

import { FEATURE_TOGGLES } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  FeatureToggleState,
  PartialFeatureToggleState,
} from "../src/featureToggles/featureToggleUtils";
import type { FeatureToggleStorage, RemoteFeatureToggleFetcher } from "../src/featureToggles/types";

const mocks = vi.hoisted<{
  toggles: FeatureToggleState;
  remoteToggles: PartialFeatureToggleState;
  localOverrides: PartialFeatureToggleState;
  stateCallIndex: number;
  setToggles: ReturnType<typeof vi.fn>;
  setRemoteToggles: ReturnType<typeof vi.fn>;
  setLocalOverrides: ReturnType<typeof vi.fn>;
  syncFeatureTogglesToStorage: ReturnType<typeof vi.fn>;
  fetchRemoteFeatureToggles: ReturnType<typeof vi.fn>;
  getFromStorage: ReturnType<typeof vi.fn>;
  setToStorage: ReturnType<typeof vi.fn>;
  effectCleanups: Array<(() => void) | void>;
}>(() => ({
  toggles: {
    "settings-screen": false,
    "backend-game-init": false,
    "points-type": false,
    "max-score-selector": false,
  },
  remoteToggles: {},
  localOverrides: {},
  stateCallIndex: 0,
  setToggles: vi.fn(),
  setRemoteToggles: vi.fn(),
  setLocalOverrides: vi.fn(),
  syncFeatureTogglesToStorage: vi.fn(),
  fetchRemoteFeatureToggles: vi.fn(),
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
    useState: () => {
      const values = [mocks.toggles, mocks.remoteToggles, mocks.localOverrides];
      const setters = [mocks.setToggles, mocks.setRemoteToggles, mocks.setLocalOverrides];
      const index = mocks.stateCallIndex;
      mocks.stateCallIndex += 1;
      return [values[index], setters[index]];
    },
    useCallback: (callback: (...args: unknown[]) => unknown) => callback,
    useMemo: (factory: () => unknown) => factory(),
    useEffect: (effect: () => void | (() => void)) => {
      mocks.effectCleanups.push(effect());
    },
  };
});

const renderProvider = async () => {
  mocks.stateCallIndex = 0;
  const { FeatureToggleProvider } = await import("../src/featureToggles/FeatureToggleProvider");

  return FeatureToggleProvider({
    children: "child",
    fetchRemoteFeatureToggles: mocks.fetchRemoteFeatureToggles as RemoteFeatureToggleFetcher,
    getFromStorage: mocks.getFromStorage as FeatureToggleStorage["getFromStorage"],
    setToStorage: mocks.setToStorage as FeatureToggleStorage["setToStorage"],
  }) as ReactElement<{
    value: {
      toggles: FeatureToggleState;
      setFeatureToggle: (name: "settings-screen", enabled: boolean) => Promise<void>;
    };
    children: (string | ReactElement)[];
  }>;
};

describe("FeatureToggleProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.toggles = { ...FEATURE_TOGGLES };
    mocks.remoteToggles = {};
    mocks.localOverrides = {};
    mocks.stateCallIndex = 0;
    mocks.effectCleanups = [];
    mocks.syncFeatureTogglesToStorage.mockResolvedValue({
      toggles: {
        ...FEATURE_TOGGLES,
        "settings-screen": true,
      },
      remoteToggles: { "settings-screen": true },
      localOverrides: {},
    });
  });

  it("provides default toggle state before sync completes", async () => {
    const { FeatureToggleContext } = await import("../src/featureToggles/toggleContext");

    const element = await renderProvider();

    expect(element.type).toBe(FeatureToggleContext.Provider);
    expect(element.props.value.toggles).toEqual(FEATURE_TOGGLES);
    expect(element.props.value.setFeatureToggle).toEqual(expect.any(Function));
    expect(element.props.children).toEqual(expect.arrayContaining(["child"]));

    const syncElement = element.props.children.find(
      (child: unknown) => typeof child === "object" && child !== null,
    ) as ReactElement;
    expect((syncElement.type as (props: Record<string, unknown>) => null)({})).toBeNull();
  });

  it("syncs remote, local, and effective toggles on mount", async () => {
    await renderProvider();

    await vi.waitFor(() => {
      expect(mocks.syncFeatureTogglesToStorage).toHaveBeenCalledWith({
        fetchRemoteFeatureToggles: mocks.fetchRemoteFeatureToggles,
        getFromStorage: mocks.getFromStorage,
        setToStorage: mocks.setToStorage,
      });
    });

    await vi.waitFor(() => {
      expect(mocks.setRemoteToggles).toHaveBeenCalledWith(expect.any(Function));
      expect(mocks.setLocalOverrides).toHaveBeenCalledWith(expect.any(Function));
      expect(mocks.setToggles).toHaveBeenCalledWith(expect.any(Function));
    });

    const updateToggles = mocks.setToggles.mock.calls[0]?.[0] as (
      current: FeatureToggleState,
    ) => FeatureToggleState;
    const syncedToggles = {
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    };
    expect(updateToggles(syncedToggles)).toBe(syncedToggles);
    expect(updateToggles(FEATURE_TOGGLES)).toEqual(syncedToggles);
  });

  it("stores only a local override when changing a toggle away from remote", async () => {
    mocks.remoteToggles = { "settings-screen": false };
    const element = await renderProvider();
    const { StorageKeys } = await import("@belot/constants");

    await element.props.value.setFeatureToggle("settings-screen", true);

    expect(mocks.setLocalOverrides).toHaveBeenCalledWith({ "settings-screen": true });
    expect(mocks.setToggles).toHaveBeenCalledWith({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    });
    expect(mocks.setToStorage).toHaveBeenCalledWith(
      StorageKeys.featureToggles,
      JSON.stringify({ "settings-screen": true }),
    );
  });

  it("removes a local override when changing a toggle back to remote", async () => {
    mocks.remoteToggles = { "settings-screen": true };
    mocks.localOverrides = { "settings-screen": false };
    const element = await renderProvider();
    const { StorageKeys } = await import("@belot/constants");

    await element.props.value.setFeatureToggle("settings-screen", true);

    expect(mocks.setLocalOverrides).toHaveBeenCalledWith({});
    expect(mocks.setToggles).toHaveBeenCalledWith({
      ...FEATURE_TOGGLES,
      "settings-screen": true,
    });
    expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.featureToggles, JSON.stringify({}));
  });

  it("does not update state after unmount when sync resolves late", async () => {
    let resolveSync: (value: {
      toggles: FeatureToggleState;
      remoteToggles: PartialFeatureToggleState;
      localOverrides: PartialFeatureToggleState;
    }) => void = () => undefined;
    const syncPromise = new Promise((resolve) => {
      resolveSync = resolve;
    });
    mocks.syncFeatureTogglesToStorage.mockReturnValue(syncPromise);

    await renderProvider();

    const cleanup = mocks.effectCleanups[0];
    cleanup?.();

    resolveSync({
      toggles: {
        ...FEATURE_TOGGLES,
        "settings-screen": true,
      },
      remoteToggles: { "settings-screen": true },
      localOverrides: {},
    });
    await Promise.resolve();

    expect(mocks.setToggles).not.toHaveBeenCalled();
    expect(mocks.setRemoteToggles).not.toHaveBeenCalled();
    expect(mocks.setLocalOverrides).not.toHaveBeenCalled();
  });
});
