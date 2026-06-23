import TableHeaderWrapper from "@/components/game-table/tableHeaderWrapper";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const headerMocks = vi.hoisted(() => ({
  roundsScores: [{ id: 0 }],
  columns: ["Alice", "Score"],
}));

vi.mock("@/hooks/game-table/useGetPlayersNamesWithScoreColumn", () => ({
  default: () => ({
    playersNamesWithScoreColumn: headerMocks.columns,
    columnsCount: 1,
  }),
}));

vi.mock("@belot/hooks", () => ({
  useGetTableHeaderDealerBackground: () => ({
    getDealerBackground: (index: number) => (index === 0 ? "bg-success" : "bg-muted"),
  }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { roundsScores: { id: number }[] }) => unknown) =>
    selector({ roundsScores: headerMocks.roundsScores }),
}));

describe("TableHeaderWrapper", () => {
  it("renders a single-round header", () => {
    headerMocks.roundsScores = [{ id: 0 }];
    headerMocks.columns = ["Alice", "Score"];

    render(
      <table>
        <TableHeaderWrapper />
      </table>,
    );

    expect(screen.getByText("Alice")).toBeTruthy();
  });

  it("renders a multi-round header with dealer styling", () => {
    headerMocks.roundsScores = [{ id: 0 }, { id: 1 }];
    headerMocks.columns = ["Alice", "Bob", "Score"];

    const { container } = render(
      <table>
        <TableHeaderWrapper />
      </table>,
    );

    expect(screen.getByText("Bob")).toBeTruthy();
    expect(container.querySelector(".bg-success")).toBeTruthy();
  });
});
