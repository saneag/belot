import { StorageKeys } from "@belot/constants";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getItemFromStorage: vi.fn(),
  setItemsToStorage: vi.fn(),
  isVisible: vi.fn(() => true),
  subscribeToVisibilityChange: vi.fn<(handler: () => void) => () => void>(() => vi.fn()),
  timeSpent: 0,
  setTimeSpent: vi.fn((value: number | ((current: number) => number)) => {
    mocks.timeSpent = typeof value === "function" ? value(mocks.timeSpent) : value;
  }),
  effectCleanup: undefined as (() => void) | undefined,
}));

vi.mock("react", () => ({
  useEffect: (effect: () => void | (() => void)) => {
    const cleanup = effect();
    mocks.effectCleanup = typeof cleanup === "function" ? cleanup : undefined;
  },
  useRef: (initial: unknown) => ({ current: initial }),
  useState: () => [mocks.timeSpent, mocks.setTimeSpent],
}));

describe("useTimeTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mocks.timeSpent = 0;
    mocks.getItemFromStorage.mockResolvedValue(null);
    mocks.setItemsToStorage.mockResolvedValue(undefined);
    mocks.isVisible.mockReturnValue(true);
    mocks.subscribeToVisibilityChange.mockImplementation(() => vi.fn());
  });

  afterEach(() => {
    mocks.effectCleanup?.();
    vi.useRealTimers();
  });

  it("initializes timer from storage and updates elapsed time", async () => {
    const startTime = Date.now() - 5000;
    mocks.getItemFromStorage.mockResolvedValue(String(startTime));

    const { useTimeTracker } = await import("../src/useTimeTracker");
    useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    await vi.waitFor(() => {
      expect(mocks.setTimeSpent).toHaveBeenCalled();
    });

    expect(mocks.getItemFromStorage).toHaveBeenCalledWith(StorageKeys.timerStartTime);
    expect(mocks.setItemsToStorage).not.toHaveBeenCalled();
    expect(mocks.subscribeToVisibilityChange).toHaveBeenCalledOnce();
  });

  it("stores start time when storage is empty", async () => {
    const { useTimeTracker } = await import("../src/useTimeTracker");
    useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    await vi.waitFor(() => {
      expect(mocks.setItemsToStorage).toHaveBeenCalled();
      const storedItems = mocks.setItemsToStorage.mock.calls.at(-1)?.[0] as Record<string, string>;
      expect(typeof storedItems[StorageKeys.timerStartTime]).toBe("string");
    });
  });

  it("formats hours, minutes, and seconds", async () => {
    mocks.timeSpent = 3661;

    const { useTimeTracker } = await import("../src/useTimeTracker");
    const result = useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(1);
    expect(result.shouldPadSeconds).toBe(true);
  });

  it("reschedules ticks when visibility returns", async () => {
    let visibilityHandler: (() => void) | undefined;
    mocks.subscribeToVisibilityChange.mockImplementation((handler: () => void) => {
      visibilityHandler = handler;
      return vi.fn();
    });

    const { useTimeTracker } = await import("../src/useTimeTracker");
    useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    expect(mocks.subscribeToVisibilityChange).toHaveBeenCalledOnce();
    expect(visibilityHandler).toBeTypeOf("function");

    visibilityHandler?.();
    expect(mocks.isVisible).toHaveBeenCalled();
  });

  it("schedules timer ticks and cleans up on unmount", async () => {
    const startTime = Date.now() - 2500;
    mocks.getItemFromStorage.mockResolvedValue(String(startTime));

    const { useTimeTracker } = await import("../src/useTimeTracker");
    useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    await vi.waitFor(() => {
      expect(mocks.setTimeSpent).toHaveBeenCalled();
    });

    await vi.advanceTimersByTimeAsync(2000);
    expect(mocks.setTimeSpent.mock.calls.length).toBeGreaterThan(1);

    mocks.effectCleanup?.();
    const callsAfterCleanup = mocks.setTimeSpent.mock.calls.length;
    await vi.advanceTimersByTimeAsync(5000);
    expect(mocks.setTimeSpent.mock.calls.length).toBe(callsAfterCleanup);
  });

  it("does not update timer after unmount during initialization", async () => {
    let resolveStorage: (value: string | null) => void = () => undefined;
    mocks.getItemFromStorage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStorage = resolve;
        }),
    );

    const { useTimeTracker } = await import("../src/useTimeTracker");
    useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    mocks.effectCleanup?.();
    resolveStorage(null);
    await Promise.resolve();

    expect(mocks.setTimeSpent).not.toHaveBeenCalled();
  });

  it("ignores visibility changes when page is hidden", async () => {
    let visibilityHandler: (() => void) | undefined;
    mocks.isVisible.mockReturnValue(false);
    mocks.subscribeToVisibilityChange.mockImplementation((handler: () => void) => {
      visibilityHandler = handler;
      return vi.fn();
    });

    const { useTimeTracker } = await import("../src/useTimeTracker");
    useTimeTracker({
      getItemFromStorage: mocks.getItemFromStorage,
      setItemsToStorage: mocks.setItemsToStorage,
      isVisible: mocks.isVisible,
      subscribeToVisibilityChange: mocks.subscribeToVisibilityChange,
    });

    const callsBefore = mocks.setTimeSpent.mock.calls.length;
    visibilityHandler?.();
    expect(mocks.setTimeSpent.mock.calls.length).toBe(callsBefore);
  });
});
