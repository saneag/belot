import { THEMES } from "@belot/constants";

import PlayersNames from "@/components/players-selection/playersNames";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/components", () => ({
  PlayersTable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PlayersNamesInputWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@belot/hooks", () => ({
  useThemeContext: () => ({ theme: THEMES.light }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { players: { id: number; name: string }[] }) => unknown) =>
    selector({
      players: [
        { id: 0, name: "Alice" },
        { id: 1, name: "Bob" },
      ],
    }),
}));

vi.mock("@belot/utils/src", () => ({
  getPlayersCount: (players: unknown[]) => players.length,
}));

vi.mock("@/components/players-selection/playersNamesInput", () => ({
  default: ({ player }: { player: { name: string } }) => <input aria-label={player.name} />,
}));

vi.mock("@/components/players-selection/playersRandomizer", () => ({
  default: () => <button type="button">Shuffle</button>,
}));

describe("PlayersNames", () => {
  it("renders player inputs and randomizer", () => {
    render(<PlayersNames />);

    expect(screen.getByRole("button", { name: "Shuffle" })).toBeTruthy();
    expect(screen.getByLabelText("Alice")).toBeTruthy();
    expect(screen.getByLabelText("Bob")).toBeTruthy();
  });
});
