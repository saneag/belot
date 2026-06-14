// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GameTablePage from "@/pages/game-table";

const useLoadGameData = vi.fn();

vi.mock("@belot/hooks", () => ({
  useLoadGameData: (...args: unknown[]) => useLoadGameData(...args),
}));

vi.mock("@/components/game-table", () => ({
  default: () => <div>Game table</div>,
}));

vi.mock("@/components/game-table/header", () => ({
  default: () => <div>Header</div>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr />,
}));

describe("GameTablePage", () => {
  it("loads game data from storage and renders layout", () => {
    render(<GameTablePage />);

    expect(useLoadGameData).toHaveBeenCalledWith({
      getFromStorage: expect.any(Function),
    });

    const getFromStorage = useLoadGameData.mock.calls[0]?.[0]?.getFromStorage;
    expect(getFromStorage("dealer")).toBeNull();

    expect(screen.getByText("Header")).toBeTruthy();
    expect(screen.getByText("Game table")).toBeTruthy();
  });
});
