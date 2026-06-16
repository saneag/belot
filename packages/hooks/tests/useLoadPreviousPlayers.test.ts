import { StorageKeys } from "@belot/constants";
import type { Player } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  storagePlayers: null as string | null,
  setStoragePlayers: vi.fn(),
  setPlayers: vi.fn(),
  getFromStorage: vi.fn(),
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useState: (initial: unknown) => {
    if (initial === null) {
      return [mocks.storagePlayers, mocks.setStoragePlayers];
    }
    return [initial, vi.fn()];
  },
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({ setPlayers: mocks.setPlayers }),
}));

describe("useLoadPreviousPlayers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.storagePlayers = null;
    mocks.getFromStorage.mockReset();
  });

  it("loads previous players from storage", async () => {
    const players: Player[] = [{ id: 0, name: "A" }];
    mocks.getFromStorage.mockResolvedValue(JSON.stringify(players));

    const { useLoadPreviousPlayers } = await import("../src/useLoadPreviousPlayers");
    const { fetchPreviousPlayers } = useLoadPreviousPlayers({
      getFromStorage: mocks.getFromStorage,
    });

    await fetchPreviousPlayers();

    expect(mocks.getFromStorage).toHaveBeenCalledWith(StorageKeys.players);
    expect(mocks.setStoragePlayers).toHaveBeenCalledWith(JSON.stringify(players));
  });

  it("does not fetch when storage players are missing", async () => {
    mocks.getFromStorage.mockResolvedValue(null);

    const { useLoadPreviousPlayers } = await import("../src/useLoadPreviousPlayers");
    const { fetchPreviousPlayers } = useLoadPreviousPlayers({
      getFromStorage: mocks.getFromStorage,
    });

    await fetchPreviousPlayers();

    expect(mocks.setStoragePlayers).not.toHaveBeenCalled();
  });

  it("logs errors when storage read fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.getFromStorage.mockRejectedValue(new Error("storage failed"));

    const { useLoadPreviousPlayers } = await import("../src/useLoadPreviousPlayers");
    const { fetchPreviousPlayers } = useLoadPreviousPlayers({
      getFromStorage: mocks.getFromStorage,
    });

    await fetchPreviousPlayers();

    expect(consoleError).toHaveBeenCalledWith("Error in useLoadPreviousPlayers", expect.any(Error));
    consoleError.mockRestore();
  });

  it("parses stored players into game store", async () => {
    const players: Player[] = [{ id: 0, name: "A" }];
    mocks.storagePlayers = JSON.stringify(players);

    const { useLoadPreviousPlayers } = await import("../src/useLoadPreviousPlayers");
    const { loadPlayersNamesFromStorage } = useLoadPreviousPlayers({
      getFromStorage: mocks.getFromStorage,
    });

    loadPlayersNamesFromStorage();

    expect(mocks.setPlayers).toHaveBeenCalledWith(players);
  });

  it("does nothing when storage players are missing", async () => {
    mocks.storagePlayers = null;

    const { useLoadPreviousPlayers } = await import("../src/useLoadPreviousPlayers");
    const { loadPlayersNamesFromStorage } = useLoadPreviousPlayers({
      getFromStorage: mocks.getFromStorage,
    });

    loadPlayersNamesFromStorage();

    expect(mocks.setPlayers).not.toHaveBeenCalled();
  });
});
