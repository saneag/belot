import { StorageKeys } from "@belot/constants";
import type { RoundScore } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const stateHolders: { value: unknown }[] = [];
  const players = [
    { id: 0, name: "A" },
    { id: 1, name: "B" },
  ];
  const roundsScores = [
    {
      id: 0,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 162,
      roundPlayer: null,
    },
  ];

  return {
    stateHolders,
    players,
    teams: [],
    mode: "classic",
    roundsScores,
    dealer: players[0],
    updateRoundScore: vi.fn(),
    setWinner: vi.fn(),
    setToLocalStorage: vi.fn(),
    setGameOverflowCount: vi.fn(),
  };
});

vi.mock("react", () => ({
  useState: (initial: unknown) => {
    const holder = { value: initial };
    mocks.stateHolders.push(holder);
    const setState = (next: unknown) => {
      holder.value =
        typeof next === "function"
          ? (next as (current: unknown) => unknown)(holder.value)
          : next;
    };
    return [holder.value, setState];
  },
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
}));

vi.mock("../src/usePointsTypeFeature", () => ({
  useIsPointsTypeEnabled: () => true,
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      players: mocks.players,
      teams: mocks.teams,
      mode: mocks.mode,
      pointsType: "points",
      roundsScores: mocks.roundsScores,
      updateRoundScore: mocks.updateRoundScore,
      dealer: mocks.dealer,
    }),
}));

vi.mock("@belot/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/utils")>();

  return {
    ...actual,
    calculateRoundScore: vi.fn((roundScore: RoundScore) => ({
      ...roundScore,
      totalRoundScore: 100,
    })),
    checkForGameWinner: vi.fn(() => null),
    prepareEmptyRoundScoreRow: vi.fn(() => ({
      id: 1,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 162,
      roundPlayer: null,
    })),
    setNextDealer: vi.fn(() => ({ dealer: mocks.dealer })),
  };
});

describe("useHandleNextRound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stateHolders.length = 0;
    mocks.roundsScores = [
      {
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 162,
        roundPlayer: null,
      },
    ];
  });

  it("clears round player on cancel", async () => {
    const { useHandleNextRound } = await import("../src/useHandleNextRound");
    const { handleCancel, setRoundPlayer } = useHandleNextRound({
      setWinner: mocks.setWinner,
      setToLocalStorage: mocks.setToLocalStorage,
    });

    setRoundPlayer(mocks.players[0]);
    handleCancel();

    const roundPlayerHolder = mocks.stateHolders[0];
    expect(roundPlayerHolder.value).toBeNull();
  });

  it("opens dialog with last round scores", async () => {
    const showDialog = vi.fn();

    const { useHandleNextRound } = await import("../src/useHandleNextRound");
    const { handleDialogOpen } = useHandleNextRound({
      setWinner: mocks.setWinner,
      setToLocalStorage: mocks.setToLocalStorage,
    });

    handleDialogOpen(showDialog);

    const roundScoreHolder = mocks.stateHolders[1];
    const roundScore = roundScoreHolder.value as RoundScore;
    expect(roundScore).toMatchObject({
      id: 0,
      totalRoundScore: 16,
      roundPlayer: null,
    });
    expect(roundScore.playersScores.length).toBeGreaterThan(0);
    expect(showDialog).toHaveBeenCalledOnce();
  });

  it("opens dialog without round scores when history is empty", async () => {
    mocks.roundsScores = [];
    const showDialog = vi.fn();

    const { useHandleNextRound } = await import("../src/useHandleNextRound");
    const { handleDialogOpen } = useHandleNextRound({
      setWinner: mocks.setWinner,
      setToLocalStorage: mocks.setToLocalStorage,
    });

    handleDialogOpen(showDialog);

    expect(showDialog).toHaveBeenCalledOnce();
  });

  it("persists next round data when round id matches", async () => {
    const utils = await import("@belot/utils");

    const { useHandleNextRound } = await import("../src/useHandleNextRound");
    const { handleNextRound } = useHandleNextRound({
      setWinner: mocks.setWinner,
      setToLocalStorage: mocks.setToLocalStorage,
    });

    handleNextRound();

    expect(mocks.updateRoundScore).toHaveBeenCalledOnce();
    expect(utils.checkForGameWinner).toHaveBeenCalledOnce();
    expect(mocks.setToLocalStorage).toHaveBeenCalledWith(
      StorageKeys.roundsScores,
      expect.any(String),
    );
    expect(mocks.setToLocalStorage).toHaveBeenCalledWith(
      StorageKeys.dealer,
      JSON.stringify(mocks.dealer),
    );
  });

  it("returns early when round id is not found", async () => {
    mocks.roundsScores = [
      {
        id: 5,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 162,
        roundPlayer: null,
      },
    ];

    const { useHandleNextRound } = await import("../src/useHandleNextRound");
    const { handleNextRound } = useHandleNextRound({
      setWinner: mocks.setWinner,
      setToLocalStorage: mocks.setToLocalStorage,
    });

    handleNextRound();

    expect(mocks.updateRoundScore).toHaveBeenCalledOnce();
    expect(mocks.setToLocalStorage).not.toHaveBeenCalled();
  });

  it("uses empty rounds when store roundsScores is not an array", async () => {
    mocks.roundsScores = null as unknown as typeof mocks.roundsScores;

    const { useHandleNextRound } = await import("../src/useHandleNextRound");
    const { handleNextRound } = useHandleNextRound({
      setWinner: mocks.setWinner,
      setToLocalStorage: mocks.setToLocalStorage,
    });

    handleNextRound();

    expect(mocks.updateRoundScore).toHaveBeenCalledOnce();
    expect(mocks.setToLocalStorage).not.toHaveBeenCalled();
  });
});
