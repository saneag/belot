import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/hooks", () => ({
  useLoadGameData: vi.fn(),
}));

vi.mock("@/components/game-table", () => ({
  default: () => <div>GameTable</div>,
}));

vi.mock("@/components/game-table/header", () => ({
  default: () => <div>Header</div>,
}));

describe("GameTableScreen", () => {
  it("renders header and game table", async () => {
    const { default: GameTableScreen } = await import("@/app/game-table");
    render(<GameTableScreen />);

    expect(screen.getByText("Header")).toBeTruthy();
    expect(screen.getByText("GameTable")).toBeTruthy();
  });
});
