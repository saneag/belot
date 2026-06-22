import { WIN_POINTS, WIN_SCORE_OPTIONS } from "@belot/constants";

import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  maxScore: 101,
  setMaxScore: vi.fn(),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: unknown) => unknown) =>
    selector({
      maxScore: mocks.maxScore,
      setMaxScore: mocks.setMaxScore,
    }),
}));

describe("useMaxScoreSelection", () => {
  it("returns maxScore from store defaulting to WIN_POINTS", async () => {
    const { useMaxScoreSelection } = await import("../src/useMaxScoreSelection");
    const { maxScore } = useMaxScoreSelection();

    expect(maxScore).toBe(WIN_POINTS);
  });

  it("returns handleMaxScoreChange that calls setMaxScore", async () => {
    const { useMaxScoreSelection } = await import("../src/useMaxScoreSelection");
    const { handleMaxScoreChange } = useMaxScoreSelection();

    handleMaxScoreChange(WIN_SCORE_OPTIONS[0]);

    expect(mocks.setMaxScore).toHaveBeenCalledWith(WIN_SCORE_OPTIONS[0]);
  });
});
