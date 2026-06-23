import RedoRoundButton from "@/components/game-table/action-buttons/redoRound";

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithTooltip } from "../../../testUtils";

const redoRoundScore = vi.fn();

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({ redoRoundTitle: "Redo round" }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (
    selector: (state: {
      undoneRoundsScores: { id: number }[];
      redoRoundScore: typeof redoRoundScore;
    }) => unknown,
  ) =>
    selector({
      undoneRoundsScores: [{ id: 0 }],
      redoRoundScore,
    }),
}));

describe("RedoRoundButton", () => {
  it("calls redoRoundScore when clicked", () => {
    renderWithTooltip(<RedoRoundButton />);

    screen.getByRole("button").click();

    expect(redoRoundScore).toHaveBeenCalled();
  });
});
