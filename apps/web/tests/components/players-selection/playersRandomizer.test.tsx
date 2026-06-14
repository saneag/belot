// @vitest-environment jsdom

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PlayersRandomizer from "@/components/players-selection/playersRandomizer";

import { renderWithTooltip } from "../../testUtils";

const shufflePlayers = vi.fn();

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({ shufflePlayers: "Shuffle players" }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { shufflePlayers: typeof shufflePlayers }) => unknown) =>
    selector({ shufflePlayers }),
}));

describe("PlayersRandomizer", () => {
  it("shuffles players when clicked", () => {
    renderWithTooltip(<PlayersRandomizer />);

    screen.getByRole("button").click();

    expect(shufflePlayers).toHaveBeenCalled();
  });
});
