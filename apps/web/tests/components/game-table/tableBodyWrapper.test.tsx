import { GameMode } from "@belot/types";

import TableBodyWrapper from "@/components/game-table/tableBodyWrapper";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/game-table/useAutoScrollTableBody", () => ({
  default: vi.fn(),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (
    selector: (state: {
      players: { id: number }[];
      roundsScores: { id: number; playersScores: unknown[]; teamsScores: unknown[] }[];
      mode: GameMode;
    }) => unknown,
  ) =>
    selector({
      players: [{ id: 0 }, { id: 1 }, { id: 2 }],
      roundsScores: [
        { id: 0, playersScores: [], teamsScores: [] },
        { id: 1, playersScores: [], teamsScores: [] },
        { id: 2, playersScores: [], teamsScores: [] },
        { id: 3, playersScores: [], teamsScores: [] },
        { id: 4, playersScores: [], teamsScores: [] },
      ],
      mode: GameMode.classic,
    }),
}));

vi.mock("@/components/game-table/pointCells", () => ({
  default: () => <td>cells</td>,
}));

describe("TableBodyWrapper", () => {
  it("renders completed round rows", () => {
    const scrollContainerRef = { current: document.createElement("div") };

    const { container } = render(
      <table>
        <TableBodyWrapper scrollContainerRef={scrollContainerRef} />
      </table>,
    );

    expect(container.querySelectorAll("tr").length).toBe(4);
    expect(container.querySelector(".border-t-2\\!")).toBeTruthy();
  });
});
