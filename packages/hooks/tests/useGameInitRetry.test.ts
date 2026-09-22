import { StorageKeys } from "@belot/constants";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  effectCleanup: undefined as (() => void) | undefined,
  enabled: true,
  getFromStorage: vi.fn(),
  setToStorage: vi.fn(),
  mutateAsync: vi.fn(),
  setGameId: vi.fn(),
  handleCatchError: vi.fn(),
  retryGameInit: vi.fn(),
}));

vi.mock("react", () => ({
  useEffect: (effect: () => void | (() => void)) => {
    mocks.effectCleanup = effect() ?? undefined;
  },
}));

vi.mock("@belot/api-client", () => ({
  useGameInit: () => ({ mutateAsync: mocks.mutateAsync }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) => selector({ setGameId: mocks.setGameId }),
}));

vi.mock("../src/featureToggles/useFeatureToggle", () => ({
  useFeatureToggle: () => mocks.enabled,
}));

vi.mock("../src/gameInitRetry", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/gameInitRetry")>()),
  retryGameInit: mocks.retryGameInit,
}));

describe("useGameInitRetry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.enabled = true;
    mocks.effectCleanup = undefined;
    mocks.getFromStorage.mockResolvedValue(
      JSON.stringify({ players: [], mode: "classic", teams: [], dealer: null }),
    );
    mocks.mutateAsync.mockResolvedValue({ id: "game-1" });
    mocks.retryGameInit.mockImplementation(
      ({ onSuccess }: { onSuccess: (gameId: string) => void }) => {
        onSuccess("game-1");
      },
    );
  });

  it("retries a pending initialization and clears it after success", async () => {
    const { useGameInitRetry } = await import("../src/useGameInitRetry");

    useGameInitRetry({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
      getApiBaseUrl: () => "https://api.example",
      handleCatchError: mocks.handleCatchError,
    });
    await Promise.resolve();

    expect(mocks.getFromStorage).toHaveBeenCalledWith(StorageKeys.pendingGameInit);
    expect(mocks.retryGameInit).toHaveBeenCalledOnce();
    expect(mocks.setGameId).toHaveBeenCalledWith("game-1");
    expect(mocks.setToStorage).toHaveBeenCalledWith(StorageKeys.pendingGameInit, "");
  });

  it("reports the terminal retry error once", async () => {
    const error = new Error("server unavailable");
    mocks.retryGameInit.mockImplementation(
      ({ onFailure }: { onFailure: (failure: unknown) => void }) => onFailure(error),
    );
    const { useGameInitRetry } = await import("../src/useGameInitRetry");

    useGameInitRetry({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
      getApiBaseUrl: () => "https://api.example",
      handleCatchError: mocks.handleCatchError,
    });
    await Promise.resolve();

    expect(mocks.handleCatchError).toHaveBeenCalledOnce();
    expect(mocks.handleCatchError).toHaveBeenCalledWith(error);
    expect(mocks.setToStorage).not.toHaveBeenCalled();
  });

  it("does not read or retry when backend initialization is disabled", async () => {
    mocks.enabled = false;
    const { useGameInitRetry } = await import("../src/useGameInitRetry");

    useGameInitRetry({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
      getApiBaseUrl: () => "https://api.example",
      handleCatchError: mocks.handleCatchError,
    });
    await Promise.resolve();

    expect(mocks.getFromStorage).not.toHaveBeenCalled();
    expect(mocks.retryGameInit).not.toHaveBeenCalled();
  });

  it("does nothing when there is no pending initialization", async () => {
    mocks.getFromStorage.mockResolvedValue(null);
    const { useGameInitRetry } = await import("../src/useGameInitRetry");

    useGameInitRetry({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
      getApiBaseUrl: () => "https://api.example",
      handleCatchError: mocks.handleCatchError,
    });
    await Promise.resolve();

    expect(mocks.retryGameInit).not.toHaveBeenCalled();
  });

  it("aborts retries when unmounted", async () => {
    const { useGameInitRetry } = await import("../src/useGameInitRetry");

    useGameInitRetry({
      getFromStorage: mocks.getFromStorage,
      setToStorage: mocks.setToStorage,
      getApiBaseUrl: () => "https://api.example",
      handleCatchError: mocks.handleCatchError,
    });

    await Promise.resolve();
    mocks.effectCleanup?.();
    const retryOptions = mocks.retryGameInit.mock.calls[0]?.[0] as
      | { signal: AbortSignal }
      | undefined;
    expect(retryOptions?.signal.aborted).toBe(true);
  });
});
