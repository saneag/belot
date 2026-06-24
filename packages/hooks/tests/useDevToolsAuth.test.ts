import { StorageKeys } from "@belot/constants";
import { DEV_TOOLS_BLOCK_DURATION_MS } from "@belot/utils";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  stateIndex: 0,
  stateValues: [] as unknown[],
  stateSetters: [] as Array<(value: unknown) => void>,
  initialStateOverrides: new Map<number, unknown>(),
  effectCleanups: [] as Array<(() => void) | void>,
  getFromStorage: vi.fn(),
  setToStorage: vi.fn(),
  now: 10_000,
  messages: {
    devToolsLockedError: "locked",
    devToolsTooManyAttemptsError: "too-many",
    devToolsIncorrectPasswordError: "incorrect",
  },
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => mocks.messages,
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useEffect: (effect: () => void | (() => void)) => {
    mocks.effectCleanups.push(effect());
  },
  useMemo: (factory: () => unknown) => factory(),
  useState: (initial: unknown) => {
    const index = mocks.stateIndex++;
    const value = mocks.initialStateOverrides.has(index)
      ? mocks.initialStateOverrides.get(index)
      : initial;
    mocks.stateValues[index] = typeof value === "function" ? (value as () => unknown)() : value;
    const setState = (next: unknown) => {
      mocks.stateValues[index] =
        typeof next === "function"
          ? (next as (current: unknown) => unknown)(mocks.stateValues[index])
          : next;
    };
    mocks.stateSetters[index] = setState;
    return [mocks.stateValues[index], setState];
  },
}));

describe("useDevToolsAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.now = 10_000;
    vi.spyOn(Date, "now").mockImplementation(() => mocks.now);
    mocks.stateIndex = 0;
    mocks.stateValues = [];
    mocks.stateSetters = [];
    mocks.initialStateOverrides = new Map();
    mocks.effectCleanups = [];
    mocks.getFromStorage.mockResolvedValue(null);
    mocks.setToStorage.mockResolvedValue(undefined);
  });

  it("initializes an active block from storage", async () => {
    mocks.getFromStorage.mockImplementation((key: StorageKeys) =>
      key === StorageKeys.devToolsFailedAttempts ? "5" : "1",
    );

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");

    useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await vi.waitFor(() => {
      expect(mocks.stateValues[1]).toBe(5);
    });
    expect(mocks.stateValues[2]).toBe(1);
    expect(mocks.stateValues[3]).toBe(mocks.now);
  });

  it("initializes failed attempts when there is no stored block", async () => {
    mocks.getFromStorage.mockImplementation((key: StorageKeys) =>
      key === StorageKeys.devToolsFailedAttempts ? "3" : null,
    );

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");

    useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await vi.waitFor(() => {
      expect(mocks.stateValues[1]).toBe(3);
    });
    expect(mocks.stateValues[2]).toBeNull();
  });

  it("updates remaining lock time while locked", async () => {
    vi.useFakeTimers();
    mocks.initialStateOverrides.set(2, 1);

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");

    useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    mocks.now = 11_000;
    vi.advanceTimersByTime(1_000);

    expect(mocks.stateValues[3]).toBe(11_000);
    const cleanup = mocks.effectCleanups[1];
    cleanup?.();
    vi.useRealTimers();
  });

  it("clears an expired stored block", async () => {
    mocks.getFromStorage.mockImplementation((key: StorageKeys) =>
      key === StorageKeys.devToolsFailedAttempts ? "5" : "1",
    );
    mocks.now = DEV_TOOLS_BLOCK_DURATION_MS + 2;

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");

    useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await vi.waitFor(() => {
      expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.devToolsFailedAttempts, "0");
    });
    expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.devToolsBlockedAt, "0");
    expect(mocks.stateValues[1]).toBe(0);
    expect(mocks.stateValues[2]).toBeNull();
  });

  it("does not update initialized auth state after cleanup", async () => {
    const resolveStorage: Array<(value: string | null) => void> = [];
    mocks.getFromStorage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStorage.push(resolve);
        }),
    );

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");

    useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    const cleanup = mocks.effectCleanups[0];
    cleanup?.();
    resolveStorage.forEach((resolve) => resolve("5"));
    await Promise.resolve();

    expect(mocks.stateValues[1]).toBe(0);
  });

  it("unlocks with the valid password and clears stored failures", async () => {
    mocks.getFromStorage.mockImplementation(() => new Promise(() => undefined));

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");
    const auth = useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await auth.submitPassword("123321");

    expect(mocks.stateValues[0]).toBe(true);
    expect(mocks.stateValues[1]).toBe(0);
    expect(mocks.stateValues[2]).toBeNull();
    expect(mocks.stateValues[4]).toBeNull();
    expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.devToolsFailedAttempts, "0");
    expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.devToolsBlockedAt, "0");
  });

  it("stores an incorrect password failure", async () => {
    mocks.getFromStorage.mockImplementation(() => new Promise(() => undefined));

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");
    const auth = useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await auth.submitPassword("wrong");

    expect(mocks.stateValues[1]).toBe(1);
    expect(mocks.stateValues[4]).toBe("incorrect");
    expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.devToolsFailedAttempts, "1");
  });

  it("blocks after the fifth failed password", async () => {
    mocks.getFromStorage.mockImplementation(() => new Promise(() => undefined));
    mocks.initialStateOverrides.set(1, 4);

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");
    const auth = useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await auth.submitPassword("wrong");

    expect(mocks.stateValues[1]).toBe(5);
    expect(mocks.stateValues[2]).toBe(mocks.now);
    expect(mocks.stateValues[4]).toBe("too-many");
    expect(mocks.setToStorage).toHaveBeenCalledWith(
      StorageKeys.devToolsBlockedAt,
      String(mocks.now),
    );
  });

  it("rejects submissions while still blocked", async () => {
    mocks.getFromStorage.mockImplementation(() => new Promise(() => undefined));
    mocks.initialStateOverrides.set(2, 1);

    const { useDevToolsAuth } = await import("../src/useDevToolsAuth");
    const auth = useDevToolsAuth({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
    });

    await auth.submitPassword("123321");

    expect(mocks.stateValues[4]).toBe("locked");
    expect(mocks.stateValues[0]).toBe(false);
  });
});
