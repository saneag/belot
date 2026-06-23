import UndoRoundButton from "@/components/game-table/action-buttons/undoRound";

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithTooltip } from "../../../testUtils";

const undoRoundScore = vi.fn();

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({ undoRoundTitle: "Undo round" }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (
    selector: (state: {
      roundsScores: { id: number }[];
      undoRoundScore: typeof undoRoundScore;
    }) => unknown,
  ) =>
    selector({
      roundsScores: [{ id: 0 }, { id: 1 }],
      undoRoundScore,
    }),
}));

describe("UndoRoundButton", () => {
  it("calls undoRoundScore when clicked", () => {
    renderWithTooltip(<UndoRoundButton />);

    screen.getByRole("button").click();

    expect(undoRoundScore).toHaveBeenCalled();
  });
});
