import { StorageKeys } from "@belot/constants";
import { GameMode, type Player, type RoundScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const skipRound = vi.fn();
  let state: unknown = {};

  return {
    skipRound,
    get state() {
      return state;
    },
    setState(nextState: unknown) {
      state = nextState;
    },
  };
});

vi.mock("react", () => ({
  useCallback: (callback: () => void) => callback,
}));

vi.mock("../src/usePointsTypeFeature", () => ({
  useEffectivePointsType: () => "micropoints",
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) => selector(mocks.state),
}));

describe("useHandleSkipRound", () => {
  const players: Player[] = [
    { id: 0, name: "A" },
    { id: 1, name: "B" },
  ];

  const initialRound: RoundScore = {
    id: 0,
    playersScores: players.map((player, index) => ({
      id: index,
      playerId: player.id,
      score: 0,
      boltCount: 0,
      totalScore: 0,
    })),
    teamsScores: [],
    totalRoundScore: 162,
    roundPlayer: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.setState({
      players,
      teams: [],
      mode: GameMode.classic,
      pointsType: "micropoints",
      roundsScores: [initialRound],
      dealer: players[0],
      skipRound: mocks.skipRound,
    });
  });

  it("persists the skipped round, next placeholder, and next dealer", async () => {
    let resolveStorage: () => void = () => undefined;
    const storageWrite = new Promise<void>((resolve) => {
      resolveStorage = resolve;
    });
    let storageItems: Partial<Record<StorageKeys, string>> | null = null;
    const setItemsToStorage = vi.fn((items: Partial<Record<StorageKeys, string>>) => {
      storageItems = items;
      return storageWrite;
    });
    const { useHandleSkipRound } = await import("../src/useHandleSkipRound");

    const handleSkipRound = useHandleSkipRound({ setItemsToStorage });

    const handleSkipRoundPromise = handleSkipRound();
    let didFinishSkipHandler = false;
    void handleSkipRoundPromise.then(() => {
      didFinishSkipHandler = true;
    });

    expect(mocks.skipRound).toHaveBeenCalledOnce();
    expect(setItemsToStorage).toHaveBeenCalledOnce();
    await Promise.resolve();
    expect(didFinishSkipHandler).toBe(false);

    resolveStorage();
    await handleSkipRoundPromise;
    expect(didFinishSkipHandler).toBe(true);

    if (!storageItems) {
      throw new Error("Expected skip round to write storage items");
    }

    const storedRoundsScores = JSON.parse(
      storageItems[StorageKeys.roundsScores] ?? "[]",
    ) as RoundScore[];
    const storedDealer = JSON.parse(storageItems[StorageKeys.dealer] ?? "null") as Player | null;

    expect(storedRoundsScores).toHaveLength(2);
    expect(storedRoundsScores[0].id).toBe(0);
    expect(storedRoundsScores[0].totalRoundScore).toBe(16);
    expect(storedRoundsScores[1].id).toBe(1);
    expect(storedRoundsScores[1].totalRoundScore).toBe(16);
    expect(storedDealer).toEqual(players[1]);
  });

  it("uses the previous completed round total when one exists", async () => {
    mocks.setState({
      players,
      teams: [],
      mode: GameMode.classic,
      roundsScores: [
        { ...initialRound, id: 0, totalRoundScore: 77 },
        { ...initialRound, id: 1, totalRoundScore: 162 },
      ],
      dealer: players[0],
      skipRound: mocks.skipRound,
    });
    const setItemsToStorage = vi.fn();
    const { useHandleSkipRound } = await import("../src/useHandleSkipRound");

    await useHandleSkipRound({ setItemsToStorage })();

    const storageItems = setItemsToStorage.mock.calls[0]?.[0] as Partial<
      Record<StorageKeys, string>
    >;
    const storedRoundsScores = JSON.parse(
      storageItems[StorageKeys.roundsScores] ?? "[]",
    ) as RoundScore[];
    expect(storedRoundsScores[1].totalRoundScore).toBe(77);
    expect(storedRoundsScores[2].totalRoundScore).toBe(77);
  });

  it("returns early when there are no rounds to skip", async () => {
    mocks.setState({
      players,
      teams: [],
      mode: GameMode.classic,
      roundsScores: [],
      dealer: players[0],
      skipRound: mocks.skipRound,
    });

    const setItemsToStorage = vi.fn();
    const { useHandleSkipRound } = await import("../src/useHandleSkipRound");
    const handleSkipRound = useHandleSkipRound({ setItemsToStorage });

    await handleSkipRound();

    expect(mocks.skipRound).toHaveBeenCalledOnce();
    expect(setItemsToStorage).not.toHaveBeenCalled();
  });

  it("omits dealer storage when next dealer cannot be resolved", async () => {
    mocks.setState({
      players: [],
      teams: [],
      mode: GameMode.classic,
      roundsScores: [initialRound],
      dealer: null,
      skipRound: mocks.skipRound,
    });

    const setItemsToStorage = vi.fn();
    const { useHandleSkipRound } = await import("../src/useHandleSkipRound");
    const handleSkipRound = useHandleSkipRound({ setItemsToStorage });

    await handleSkipRound();

    const storageItems = setItemsToStorage.mock.calls[0]?.[0] as Partial<
      Record<StorageKeys, string>
    >;
    expect(storageItems[StorageKeys.roundsScores]).toBeDefined();
    expect(storageItems[StorageKeys.dealer]).toBeUndefined();
  });

  it("uses empty rounds when store roundsScores is not an array", async () => {
    mocks.setState({
      players,
      teams: [],
      mode: GameMode.classic,
      roundsScores: null,
      dealer: players[0],
      skipRound: mocks.skipRound,
    });

    const setItemsToStorage = vi.fn();
    const { useHandleSkipRound } = await import("../src/useHandleSkipRound");
    const handleSkipRound = useHandleSkipRound({ setItemsToStorage });

    await handleSkipRound();

    expect(setItemsToStorage).not.toHaveBeenCalled();
  });
});
