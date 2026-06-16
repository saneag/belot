import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  onScoreChange: vi.fn(),
  lastSyncedScoreRef: {
    current: null as {
      opponentId: number;
      totalRoundScore: number;
      score: number;
    } | null,
  },
}));

vi.mock("react", () => ({
  useRef: () => mocks.lastSyncedScoreRef,
  useEffect: (effect: () => void) => {
    effect();
  },
}));

describe("useSyncPlayerScoreInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.lastSyncedScoreRef.current = null;
    vi.resetModules();
  });

  it("skips sync when total round score is zero", async () => {
    const { useSyncPlayerScoreInput } = await import("../src/useSyncPlayerScoreInput");

    useSyncPlayerScoreInput({
      opponentId: 0,
      totalRoundScore: 0,
      targetScore: 0,
      onScoreChange: mocks.onScoreChange,
    });

    expect(mocks.onScoreChange).not.toHaveBeenCalled();
    expect(mocks.lastSyncedScoreRef.current).toBeNull();
  });

  it("syncs score when total round score is set", async () => {
    const { useSyncPlayerScoreInput } = await import("../src/useSyncPlayerScoreInput");

    useSyncPlayerScoreInput({
      opponentId: 0,
      totalRoundScore: 162,
      targetScore: 25,
      onScoreChange: mocks.onScoreChange,
    });

    expect(mocks.onScoreChange).toHaveBeenCalledWith(25);
    expect(mocks.lastSyncedScoreRef.current).toEqual({
      opponentId: 0,
      totalRoundScore: 162,
      score: 25,
    });
  });

  it("skips redundant sync when score has not changed", async () => {
    const { useSyncPlayerScoreInput } = await import("../src/useSyncPlayerScoreInput");

    useSyncPlayerScoreInput({
      opponentId: 0,
      totalRoundScore: 162,
      targetScore: 25,
      onScoreChange: mocks.onScoreChange,
    });

    mocks.onScoreChange.mockClear();

    useSyncPlayerScoreInput({
      opponentId: 0,
      totalRoundScore: 162,
      targetScore: 25,
      onScoreChange: mocks.onScoreChange,
    });

    expect(mocks.onScoreChange).not.toHaveBeenCalled();
  });
});
