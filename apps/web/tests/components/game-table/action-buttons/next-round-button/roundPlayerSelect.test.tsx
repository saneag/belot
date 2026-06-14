// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RoundPlayerSelect from "@/components/game-table/action-buttons/next-round-button/roundPlayerSelect";

const setRoundPlayer = vi.fn();

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Select player",
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

describe("RoundPlayerSelect", () => {
  it("selects a round player", () => {
    render(<RoundPlayerSelect setRoundPlayer={setRoundPlayer} />);

    screen.getByRole("button", { name: "Alice" }).click();

    expect(setRoundPlayer).toHaveBeenCalledWith({ id: 0, name: "Alice" });
  });
});
