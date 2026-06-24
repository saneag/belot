import { WIN_SCORE_OPTIONS } from "@belot/constants";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const maxScoreMocks = vi.hoisted(() => ({
  maxScore: 51,
  handleMaxScoreChange: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useMaxScoreSelection: () => ({
    maxScore: maxScoreMocks.maxScore,
    handleMaxScoreChange: maxScoreMocks.handleMaxScoreChange,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string) => key,
}));

describe("MaxScoreSelector", () => {
  it("renders score options and handles selection", async () => {
    const { default: MaxScoreSelector } =
      await import("@/components/players-selection/maxScoreSelector");

    render(<MaxScoreSelector />);

    expect(screen.getByText("players.maxScore.label")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: String(WIN_SCORE_OPTIONS[1]) }));

    expect(maxScoreMocks.handleMaxScoreChange).toHaveBeenCalledWith(WIN_SCORE_OPTIONS[1]);
  });
});
