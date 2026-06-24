import { POINTS_TYPE, StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const settings = { pointsType: "micropoints" };
  const settingsRef = { current: settings };

  return {
    settings,
    settingsRef,
    setSettings: vi.fn(),
    getFromStorage: vi.fn(),
    setToStorage: vi.fn(),
    storageRequestIdRef: { current: 0 },
  };
});

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useEffect: (effect: () => void) => {
    effect();
  },
  useReducer: (
    reducer: (
      state: typeof mocks.settings,
      action: Partial<typeof mocks.settings>,
    ) => typeof mocks.settings,
    initialState: typeof mocks.settings,
  ) => {
    mocks.settingsRef.current = reducer(initialState, {});
    const dispatch = (action: Partial<typeof mocks.settings>) => {
      mocks.settingsRef.current = reducer(mocks.settingsRef.current, action);
      mocks.setSettings(action);
    };

    return [mocks.settingsRef.current, dispatch];
  },
  useRef: (initial: unknown) => {
    if (typeof initial === "object" && initial !== null && "pointsType" in initial) {
      return mocks.settingsRef;
    }

    return mocks.storageRequestIdRef;
  },
}));

describe("useSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.settings.pointsType = POINTS_TYPE[0].id;
    mocks.settingsRef.current = mocks.settings;
    mocks.storageRequestIdRef.current = 0;
    mocks.getFromStorage.mockReset();
    mocks.setToStorage.mockResolvedValue(undefined);
  });

  it("loads settings from storage", async () => {
    const storedSettings = { pointsType: POINTS_TYPE[1].id };
    mocks.getFromStorage.mockResolvedValue(JSON.stringify(storedSettings));

    const { useSettings } = await import("../src/useSettings");
    const { getSettingsFromLocalStorage } = useSettings({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await getSettingsFromLocalStorage();

    expect(mocks.getFromStorage).toHaveBeenCalledWith(StorageKeys.settings);
    expect(mocks.settingsRef.current).toEqual(storedSettings);
  });

  it("does not update settings when stored settings match current state", async () => {
    mocks.getFromStorage.mockResolvedValue(JSON.stringify({ pointsType: POINTS_TYPE[0].id }));

    const { useSettings } = await import("../src/useSettings");
    const { getSettingsFromLocalStorage } = useSettings({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await getSettingsFromLocalStorage();

    expect(mocks.setSettings).not.toHaveBeenCalled();
  });

  it("ignores stale storage responses", async () => {
    let resolveFirst: (value: string) => void = () => undefined;
    mocks.getFromStorage
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce(JSON.stringify({ pointsType: POINTS_TYPE[1].id }));

    const { useSettings } = await import("../src/useSettings");
    const { getSettingsFromLocalStorage } = useSettings({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    const firstRequest = getSettingsFromLocalStorage();
    await getSettingsFromLocalStorage();
    resolveFirst(JSON.stringify({ pointsType: POINTS_TYPE[0].id }));
    await firstRequest;

    expect(mocks.settingsRef.current).toEqual({ pointsType: POINTS_TYPE[1].id });
  });

  it("skips loading when storage is empty", async () => {
    mocks.getFromStorage.mockResolvedValue(null);

    const { useSettings } = await import("../src/useSettings");
    const { getSettingsFromLocalStorage } = useSettings({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await getSettingsFromLocalStorage();

    expect(mocks.settingsRef.current.pointsType).toBe(POINTS_TYPE[0].id);
  });

  it("persists merged settings to storage", async () => {
    const { useSettings } = await import("../src/useSettings");
    const { setSettings } = useSettings({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await setSettings({ pointsType: POINTS_TYPE[1].id });

    expect(mocks.settingsRef.current).toEqual({ pointsType: POINTS_TYPE[1].id });
    expect(mocks.setToStorage).toHaveBeenCalledWith(
      StorageKeys.settings,
      JSON.stringify({ pointsType: POINTS_TYPE[1].id }),
    );
  });

  it("skips persisting unchanged settings", async () => {
    const { useSettings } = await import("../src/useSettings");
    const { setSettings } = useSettings({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await setSettings({ pointsType: POINTS_TYPE[0].id });

    expect(mocks.setToStorage).not.toHaveBeenCalled();
  });
});
