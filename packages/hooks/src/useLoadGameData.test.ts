import { StorageKeys } from "@belot/constants";
import type { Player, RoundScore } from "@belot/types";

import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const setPlayers = vi.fn();
  const setDealer = vi.fn();
  const setRoundsScores = vi.fn();
  const setStorageState = vi.fn();

  return {
    setPlayers,
    setDealer,
    setRoundsScores,
    setStorageState,
  };
});

vi.mock("react", () => ({
  useEffect: (effect: () => void) => {
    effect();
  },
  useRef: () => ({ current: false }),
  useState: (initialValue: unknown) => [initialValue, mocks.setStorageState],
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      players: [],
      dealer: null,
      roundsScores: [],
      setPlayers: mocks.setPlayers,
      setDealer: mocks.setDealer,
      setRoundsScores: mocks.setRoundsScores,
    }),
}));

describe("useLoadGameData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("restores the saved dealer after rounds so hydration does not advance it", async () => {
    const players: Player[] = [
      { id: 0, name: "A" },
      { id: 1, name: "B" },
    ];
    const dealer = players[0];
    const roundsScores: RoundScore[] = [
      {
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 162,
        roundPlayer: null,
      },
    ];

    const storage: Partial<Record<StorageKeys, string>> = {
      [StorageKeys.players]: JSON.stringify(players),
      [StorageKeys.dealer]: JSON.stringify(dealer),
      [StorageKeys.roundsScores]: JSON.stringify(roundsScores),
    };

    const { useLoadGameData } = await import("./useLoadGameData");

    useLoadGameData({
      getFromStorage: (key) => storage[key] ?? null,
    });

    await vi.waitFor(() => {
      expect(mocks.setDealer).toHaveBeenCalledWith(dealer);
    });

    expect(mocks.setPlayers).toHaveBeenCalledWith(players);
    expect(mocks.setRoundsScores).toHaveBeenCalledWith(roundsScores);
    expect(mocks.setPlayers.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.setRoundsScores.mock.invocationCallOrder[0],
    );
    expect(mocks.setRoundsScores.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.setDealer.mock.invocationCallOrder[0],
    );
  });
});
