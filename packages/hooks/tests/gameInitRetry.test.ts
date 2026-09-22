import { describe, expect, it, vi } from "vitest";

import {
  GAME_INIT_RETRY_INTERVAL_MS,
  GAME_INIT_RETRY_TIMEOUT_MS,
  parsePendingGameInit,
  retryGameInit,
} from "../src/gameInitRetry";

describe("retryGameInit", () => {
  it("waits between attempts", async () => {
    vi.useFakeTimers();
    try {
      const initGame = vi
        .fn<() => Promise<{ id: string }>>()
        .mockRejectedValueOnce(new Error("cold start"))
        .mockResolvedValue({ id: "game-1" });
      const promise = retryGameInit({
        initGame,
        onSuccess: vi.fn(),
        onFailure: vi.fn(),
        signal: new AbortController().signal,
      });

      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(GAME_INIT_RETRY_INTERVAL_MS);
      await promise;

      expect(initGame).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("cancels a scheduled retry when aborted", async () => {
    vi.useFakeTimers();
    try {
      const controller = new AbortController();
      const initGame = vi.fn<() => Promise<{ id: string }>>().mockRejectedValue(new Error("down"));
      const onFailure = vi.fn();
      const promise = retryGameInit({
        initGame,
        onSuccess: vi.fn(),
        onFailure,
        signal: controller.signal,
      });

      await Promise.resolve();
      controller.abort();
      await promise;

      expect(onFailure).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("retries silently until initialization succeeds", async () => {
    const initGame = vi
      .fn<() => Promise<{ id: string }>>()
      .mockRejectedValueOnce(new Error("cold start"))
      .mockResolvedValue({ id: "game-1" });
    const onSuccess = vi.fn();
    const onFailure = vi.fn();

    await retryGameInit({
      initGame,
      onSuccess,
      onFailure,
      signal: new AbortController().signal,
      wait: vi.fn().mockResolvedValue(undefined),
    });

    expect(initGame).toHaveBeenCalledTimes(2);
    expect(onSuccess).toHaveBeenCalledWith("game-1");
    expect(onFailure).not.toHaveBeenCalled();
  });

  it("reports only the final error after the retry timeout", async () => {
    const error = new Error("server unavailable");
    const initGame = vi.fn<() => Promise<{ id: string }>>().mockRejectedValue(error);
    const onFailure = vi.fn();
    const now = vi
      .fn<() => number>()
      .mockReturnValueOnce(0)
      .mockReturnValue(GAME_INIT_RETRY_TIMEOUT_MS);

    await retryGameInit({
      initGame,
      onSuccess: vi.fn(),
      onFailure,
      signal: new AbortController().signal,
      now,
      wait: vi.fn().mockResolvedValue(undefined),
    });

    expect(initGame).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledOnce();
    expect(onFailure).toHaveBeenCalledWith(error);
  });
});

describe("parsePendingGameInit", () => {
  it("returns null for missing or malformed storage", () => {
    expect(parsePendingGameInit(null)).toBeNull();
    expect(parsePendingGameInit("not json")).toBeNull();
  });
});
