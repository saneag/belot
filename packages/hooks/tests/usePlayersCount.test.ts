import { PLAYERS_COUNT } from "@belot/constants";
import type { Player } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resetValidations: vi.fn(),
  setEmptyPlayersNames: vi.fn(),
  players: [] as Player[],
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
  useEffect: (effect: () => void) => {
    effect();
  },
}));

vi.mock("../src/usePlayersSelectionContext", () => ({
  usePlayersSelectionContext: () => ({
    resetValidations: mocks.resetValidations,
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      players: mocks.players,
      setEmptyPlayersNames: mocks.setEmptyPlayersNames,
    }),
}));

describe("usePlayersCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.players = [];
  });

  it("defaults empty players to first PLAYERS_COUNT option", async () => {
    const { usePlayersCount } = await import("../src/usePlayersCount");
    usePlayersCount();

    expect(mocks.setEmptyPlayersNames).toHaveBeenCalledWith(PLAYERS_COUNT[0]);
  });

  it("changes player count and resets validations", async () => {
    mocks.players = [
      { id: 0, name: "A" },
      { id: 1, name: "B" },
    ];

    const { usePlayersCount } = await import("../src/usePlayersCount");
    const { playersCount, handlePlayersCountChange } = usePlayersCount();

    expect(playersCount).toBe(2);
    handlePlayersCountChange(4);

    expect(mocks.setEmptyPlayersNames).toHaveBeenCalledWith(4);
    expect(mocks.resetValidations).toHaveBeenCalledOnce();
  });
});
