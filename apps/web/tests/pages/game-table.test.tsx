// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GameTablePage from "@/pages/game-table";

const useLoadGameData = vi.fn<(options: { getFromStorage: (key: string) => unknown }) => void>();

vi.mock("@belot/hooks", () => ({
  useLoadGameData: (options: { getFromStorage: (key: string) => unknown }) => {
    useLoadGameData(options);
  },
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

    expect(useLoadGameData).toHaveBeenCalledOnce();

    const options = useLoadGameData.mock.calls[0]?.[0];
    expect(typeof options?.getFromStorage).toBe("function");
    expect(options?.getFromStorage("dealer")).toBeNull();

    expect(screen.getByText("Header")).toBeTruthy();
    expect(screen.getByText("Game table")).toBeTruthy();
  });
});
