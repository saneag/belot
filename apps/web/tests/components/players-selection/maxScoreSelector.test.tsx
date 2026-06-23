// @vitest-environment jsdom
import MaxScoreSelector from "@/components/players-selection/maxScoreSelector";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const handleMaxScoreChange = vi.fn();

vi.mock("@belot/hooks", () => ({
  useMaxScoreSelection: () => ({
    maxScore: 101,
    handleMaxScoreChange,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Maximum score",
}));

afterEach(cleanup);

describe("MaxScoreSelector", () => {
  it("renders score options and highlights the active one", () => {
    render(<MaxScoreSelector />);

    expect(screen.getByText("Maximum score")).toBeTruthy();
    expect(screen.getByRole("button", { name: "51" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "101" })).toBeTruthy();
  });

  it("calls handleMaxScoreChange when an option is clicked", () => {
    render(<MaxScoreSelector />);

    screen.getByTestId("max-score-button-51").click();

    expect(handleMaxScoreChange).toHaveBeenCalledWith(51);
  });
});
