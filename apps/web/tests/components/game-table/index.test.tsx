// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import GameTable from "@/components/game-table";

const mobileMocks = vi.hoisted(() => ({
  isMobile: false,
}));

vi.mock("@/helpers/isMobile", () => ({
  isMobile: () => mobileMocks.isMobile,
}));

vi.mock("@/components/game-table/tableHeaderWrapper", () => ({
  default: () => (
    <thead>
      <tr>
        <th>Header</th>
      </tr>
    </thead>
  ),
}));

vi.mock("@/components/game-table/tableBodyWrapper", () => ({
  default: () => (
    <tbody>
      <tr>
        <td>Body</td>
      </tr>
    </tbody>
  ),
}));

vi.mock("@/components/game-table/action-buttons/undoRound", () => ({
  default: () => <button type="button">Undo</button>,
}));

vi.mock("@/components/game-table/action-buttons/redoRound", () => ({
  default: () => <button type="button">Redo</button>,
}));

vi.mock("@/components/game-table/action-buttons/skipRound", () => ({
  default: () => <button type="button">Skip</button>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button", () => ({
  default: ({ setWinner }: { setWinner: (winner: { id: number; name: string }) => void }) => (
    <button type="button" onClick={() => setWinner({ id: 0, name: "Alice" })}>
      Next
    </button>
  ),
}));

vi.mock("@/components/game-table/action-buttons/resetGame", () => ({
  default: () => <button type="button">Reset</button>,
}));

vi.mock("@/components/game-table/winDialog", () => ({
  default: () => <div>Win dialog</div>,
}));

describe("GameTable", () => {
  afterEach(() => {
    cleanup();
    mobileMocks.isMobile = false;
  });

  it("renders table and action buttons", () => {
    render(<GameTable />);

    expect(screen.getByText("Header")).toBeTruthy();
    expect(screen.getByText("Body")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
  });

  it("shows reset button when there is a winner", async () => {
    render(<GameTable />);

    screen.getByRole("button", { name: "Next" }).click();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Reset" })).toBeTruthy();
    });
    expect(screen.getByText("Win dialog")).toBeTruthy();
  });

  it("uses mobile layout sizing when on a phone", () => {
    mobileMocks.isMobile = true;

    const { container } = render(<GameTable />);

    expect(container.querySelector("[style*='max-height']")).toBeTruthy();
  });
});
