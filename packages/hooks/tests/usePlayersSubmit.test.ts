import { StorageKeys } from "@belot/constants";
import type { Player } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const players = [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
  ];

  return {
    players,
    dealer: players[0],
    mode: "classic",
    setValidations: vi.fn(),
    setEmptyRoundScore: vi.fn(),
    setGameId: vi.fn(),
    navigateFunction: vi.fn(),
    setItemsToStorage: vi.fn(),
    getApiBaseUrl: vi.fn(() => "https://api.example"),
    handleCatchError: vi.fn(),
    mutate: vi.fn(),
  };
});

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
}));

vi.mock("../src/usePlayersSelectionContext", () => ({
  usePlayersSelectionContext: () => ({
    setValidations: mocks.setValidations,
  }),
}));

vi.mock("@belot/api-client", () => ({
  useGameInit: () => ({
    mutate: mocks.mutate,
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      players: mocks.players,
      dealer: mocks.dealer,
      mode: mocks.mode,
      setEmptyRoundScore: mocks.setEmptyRoundScore,
      setGameId: mocks.setGameId,
    }),
}));

vi.mock("@belot/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/utils")>();

  return {
    ...actual,
    validatePlayersNames: vi.fn((players: Player[]) => ({
      emptyNames: players.some((player) => !player.name) ? [0] : [],
      repeatingNames: [],
    })),
    isPlayerNameValid: vi.fn((validation: { emptyNames: number[] }) => {
      return validation.emptyNames.length === 0;
    }),
    prepareEmptyRoundScoreRow: vi.fn(() => ({
      id: 0,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 162,
      roundPlayer: null,
    })),
    prepareTeams: vi.fn(() => []),
  };
});

describe("usePlayersSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.players = [
      { id: 0, name: "Alice" },
      { id: 1, name: "Bob" },
    ];
    mocks.setItemsToStorage.mockResolvedValue(undefined);
  });

  it("blocks dialog open when names are invalid", async () => {
    mocks.players = [{ id: 0, name: "" }];
    const showDialog = vi.fn();

    const { usePlayersSubmit } = await import("../src/usePlayersSubmit");
    const { handleOpenDialog } = usePlayersSubmit({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
      getApiBaseUrl: mocks.getApiBaseUrl,
      handleCatchError: mocks.handleCatchError,
    });

    handleOpenDialog(showDialog);

    expect(mocks.setValidations).toHaveBeenCalledOnce();
    expect(showDialog).not.toHaveBeenCalled();
  });

  it("opens dialog when names are valid", async () => {
    const showDialog = vi.fn();

    const { usePlayersSubmit } = await import("../src/usePlayersSubmit");
    const { handleOpenDialog } = usePlayersSubmit({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
      getApiBaseUrl: mocks.getApiBaseUrl,
      handleCatchError: mocks.handleCatchError,
    });

    handleOpenDialog(showDialog);

    expect(showDialog).toHaveBeenCalledOnce();
  });

  it("submits players, persists storage, and initializes game", async () => {
    const { usePlayersSubmit } = await import("../src/usePlayersSubmit");
    const { handleSubmit } = usePlayersSubmit({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
      getApiBaseUrl: mocks.getApiBaseUrl,
      handleCatchError: mocks.handleCatchError,
    });

    await handleSubmit();

    expect(mocks.setEmptyRoundScore).toHaveBeenCalledOnce();
    expect(mocks.setItemsToStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        [StorageKeys.timerStartTime]: "",
        [StorageKeys.players]: JSON.stringify(mocks.players),
        [StorageKeys.dealer]: JSON.stringify(mocks.dealer),
      }),
    );
    const storedItems = mocks.setItemsToStorage.mock.calls[0]?.[0] as Record<string, string>;
    expect(typeof storedItems[StorageKeys.roundsScores]).toBe("string");
    expect(mocks.navigateFunction).toHaveBeenCalledOnce();
    expect(mocks.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        players: mocks.players,
        mode: mocks.mode,
      }),
      expect.any(Object),
    );
    const mutateOptions = mocks.mutate.mock.calls[0]?.[1] as {
      onSuccess: unknown;
      onError: unknown;
    };
    expect(typeof mutateOptions.onSuccess).toBe("function");
    expect(typeof mutateOptions.onError).toBe("function");
  });

  it("handles init game success and error callbacks", async () => {
    const { usePlayersSubmit } = await import("../src/usePlayersSubmit");
    const { handleSubmit } = usePlayersSubmit({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
      getApiBaseUrl: mocks.getApiBaseUrl,
      handleCatchError: mocks.handleCatchError,
    });

    await handleSubmit();

    const mutateCall = mocks.mutate.mock.calls[0];
    const options = mutateCall?.[1] as {
      onSuccess: (response: { id: string }) => void;
      onError: (error: unknown) => void;
    };

    options.onSuccess({ id: "game-1" });
    expect(mocks.setGameId).toHaveBeenCalledWith("game-1");

    const error = new Error("init failed");
    options.onError(error);
    expect(mocks.handleCatchError).toHaveBeenCalledWith(error);
  });

  it("returns early on submit when validation fails", async () => {
    mocks.players = [{ id: 0, name: "" }];

    const { usePlayersSubmit } = await import("../src/usePlayersSubmit");
    const { handleSubmit } = usePlayersSubmit({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
      getApiBaseUrl: mocks.getApiBaseUrl,
      handleCatchError: mocks.handleCatchError,
    });

    await handleSubmit();

    expect(mocks.setEmptyRoundScore).not.toHaveBeenCalled();
    expect(mocks.navigateFunction).not.toHaveBeenCalled();
  });

  it("submits with null dealer when dealer is missing", async () => {
    mocks.dealer = null as unknown as typeof mocks.dealer;

    const { usePlayersSubmit } = await import("../src/usePlayersSubmit");
    const { handleSubmit } = usePlayersSubmit({
      navigateFunction: mocks.navigateFunction,
      setItemsToStorage: mocks.setItemsToStorage,
      getApiBaseUrl: mocks.getApiBaseUrl,
      handleCatchError: mocks.handleCatchError,
    });

    await handleSubmit();

    expect(mocks.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        dealer: null,
      }),
      expect.any(Object),
    );
  });
});
