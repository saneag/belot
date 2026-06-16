import { StorageKeys } from "@belot/constants";
import type { Player, RoundScore } from "@belot/types";

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { useIsPointsTypeEnabled } from "../src/usePointsTypeFeature";

const mocks = vi.hoisted(() => {
  const setPlayers = vi.fn();
  const setDealer = vi.fn();
  const setRoundsScores = vi.fn();
  const setPointsType = vi.fn();
  const stateHolders: { value: unknown }[] = [];
  const hasFetchedRef = { current: false };

  return {
    setPlayers,
    setDealer,
    setRoundsScores,
    setPointsType,
    stateHolders,
    hasFetchedRef,
    storeState: {
      players: [] as Player[],
      dealer: null as Player | null,
      roundsScores: [] as RoundScore[],
    },
  };
});

vi.mock("react", () => ({
  useEffect: (effect: () => void) => {
    effect();
  },
  useRef: (initialValue: unknown) => {
    if (initialValue === false) {
      return mocks.hasFetchedRef;
    }

    return { current: initialValue };
  },
  useState: (initialValue: unknown) => {
    const holder = { value: initialValue };
    mocks.stateHolders.push(holder);
    const setState = (next: unknown) => {
      holder.value =
        typeof next === "function"
          ? (next as (current: unknown) => unknown)(holder.value)
          : next;
    };
    return [holder.value, setState];
  },
}));

vi.mock("../src/usePointsTypeFeature", () => ({
  useIsPointsTypeEnabled: vi.fn(() => false),
}));

vi.mock("@belot/store", () => ({
  useGameStore: Object.assign(
    (selector: (state: unknown) => unknown) =>
      selector({
        players: mocks.storeState.players,
        dealer: mocks.storeState.dealer,
        roundsScores: mocks.storeState.roundsScores,
        pointsType: "micropoints",
        setPlayers: mocks.setPlayers,
        setDealer: mocks.setDealer,
        setRoundsScores: mocks.setRoundsScores,
        setPointsType: mocks.setPointsType,
      }),
    {
      getState: () => ({
        pointsType: "micropoints",
      }),
    },
  ),
}));

describe("useLoadGameData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stateHolders.length = 0;
    mocks.hasFetchedRef.current = false;
    mocks.storeState.players = [];
    mocks.storeState.dealer = null;
    mocks.storeState.roundsScores = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("restores default settings when stored points type is invalid", async () => {
    vi.mocked(useIsPointsTypeEnabled).mockReturnValue(true);

    const setToStorage = vi.fn().mockResolvedValue(undefined);
    const storage: Partial<Record<StorageKeys, string>> = {
      [StorageKeys.settings]: JSON.stringify({ pointsType: "invalid" }),
    };

    const { useLoadGameData } = await import("../src/useLoadGameData");

    useLoadGameData({
      getFromStorage: (key) => storage[key] ?? null,
      setToStorage,
    });

    await vi.waitFor(() => {
      expect(setToStorage).toHaveBeenCalledWith(
        StorageKeys.settings,
        JSON.stringify({ pointsType: "micropoints" }),
      );
    });

    expect(mocks.setPointsType).not.toHaveBeenCalled();
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

    const { useLoadGameData } = await import("../src/useLoadGameData");

    useLoadGameData({
      getFromStorage: (key) => storage[key] ?? null,
    });

    await vi.waitFor(() => {
      expect(mocks.setDealer).toHaveBeenCalledWith(dealer);
    });

    expect(mocks.setPlayers).toHaveBeenCalledWith(players);
    expect(mocks.setRoundsScores).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 0,
        totalRoundScore: 162,
      }),
    ]);
    const restoredRoundsScores = mocks.setRoundsScores.mock
      .calls[0]?.[0] as RoundScore[];
    expect(restoredRoundsScores[0].playersScores).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ playerId: 0, score: 0 }),
      ]),
    );
    expect(mocks.setPlayers.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.setRoundsScores.mock.invocationCallOrder[0],
    );
    expect(mocks.setRoundsScores.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.setDealer.mock.invocationCallOrder[0],
    );
  });

  it("returns parsed storage data without setting store when shouldSetData is false", async () => {
    const players: Player[] = [{ id: 0, name: "A" }];
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

    const { useLoadGameData } = await import("../src/useLoadGameData");
    useLoadGameData({
      getFromStorage: (key) => storage[key] ?? null,
      shouldSetData: false,
    });

    await vi.waitFor(() => {
      expect(mocks.stateHolders[0]?.value).toEqual(players);
    });

    expect(mocks.stateHolders[1]?.value).toEqual(dealer);
    const loadedRoundsScores = mocks.stateHolders[2]?.value as RoundScore[];
    expect(loadedRoundsScores[0]).toMatchObject({
      id: 0,
      totalRoundScore: 162,
    });
    expect(loadedRoundsScores[0].playersScores).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ playerId: 0, score: 0 }),
      ]),
    );
    expect(mocks.setPlayers).not.toHaveBeenCalled();
    expect(mocks.setDealer).not.toHaveBeenCalled();
    expect(mocks.setRoundsScores).not.toHaveBeenCalled();
  });

  it("does not fetch when storage values are incomplete", async () => {
    const storage: Partial<Record<StorageKeys, string>> = {
      [StorageKeys.players]: JSON.stringify([{ id: 0, name: "A" }]),
    };

    const { useLoadGameData } = await import("../src/useLoadGameData");

    useLoadGameData({
      getFromStorage: (key) => storage[key] ?? null,
    });

    await Promise.resolve();

    expect(mocks.setPlayers).not.toHaveBeenCalled();
    expect(mocks.setDealer).not.toHaveBeenCalled();
    expect(mocks.setRoundsScores).not.toHaveBeenCalled();
  });

  it("skips fetch when game store already has saved state", async () => {
    const players: Player[] = [{ id: 0, name: "A" }];
    mocks.storeState.players = players;
    mocks.storeState.dealer = players[0];
    mocks.storeState.roundsScores = [
      {
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 162,
        roundPlayer: null,
      },
    ];

    const getFromStorage = vi.fn();
    const { useLoadGameData } = await import("../src/useLoadGameData");

    useLoadGameData({ getFromStorage });

    await Promise.resolve();

    expect(getFromStorage).not.toHaveBeenCalled();
    expect(mocks.hasFetchedRef.current).toBe(false);
  });
});
