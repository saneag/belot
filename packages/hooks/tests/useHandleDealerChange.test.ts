import type { Player } from "@belot/types";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const players: Player[] = [
    { id: 0, name: "A" },
    { id: 1, name: "B" },
  ];

  return {
    players,
    dealer: null as Player | null,
    setDealer: vi.fn(),
  };
});

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useEffect: (effect: () => void) => {
    effect();
  },
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      players: mocks.players,
      dealer: mocks.dealer,
      setDealer: mocks.setDealer,
    }),
}));

describe("useHandleDealerChange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.players = [
      { id: 0, name: "A" },
      { id: 1, name: "B" },
    ];
    mocks.dealer = null;
  });

  it("sets first player as dealer when dealer is missing", async () => {
    const { useHandleDealerChange } = await import("../src/useHandleDealerChange");
    useHandleDealerChange();

    expect(mocks.setDealer).toHaveBeenCalledWith(mocks.players[0]);
  });

  it("updates dealer via handleDealerChange", async () => {
    mocks.dealer = mocks.players[0];

    const { useHandleDealerChange } = await import("../src/useHandleDealerChange");
    const { handleDealerChange } = useHandleDealerChange();

    handleDealerChange(mocks.players[1]);
    expect(mocks.setDealer).toHaveBeenCalledWith(mocks.players[1]);
  });
});
