// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  players: [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
  ],
  theme: "light",
}));

vi.mock("@belot/hooks", () => ({
  useThemeContext: () => ({ theme: mocks.theme }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { players: typeof mocks.players }) => unknown) =>
    selector({ players: mocks.players }),
}));

vi.mock("@belot/components", () => ({
  PlayersNamesInputWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PlayersTable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@belot/utils/src", () => ({
  getPlayersCount: (players: unknown[]) => players.length,
}));

vi.mock("@/components/players-selection/playersRandomizer", () => ({
  default: () => <div>Randomizer</div>,
}));

vi.mock("@/components/players-selection/playersNamesInput", () => ({
  default: ({ player }: { player: { name: string } }) => <span>{player.name}</span>,
}));

describe("PlayersNames", () => {
  it("renders player name inputs", async () => {
    const { default: PlayersNames } = await import("@/components/players-selection/playersNames");
    render(<PlayersNames />);

    expect(screen.getByText("Randomizer")).toBeTruthy();
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });
});
