// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RoundPlayerDisplay from "@/components/game-table/action-buttons/next-round-button/roundPlayerDisplay";

vi.mock("@belot/localizations", () => ({
  useLocalization: (_key: string, args?: unknown[]) => `Player:${String(args?.[0] ?? "")}`,
}));

describe("RoundPlayerDisplay", () => {
  it("renders selected player and clears selection on edit", () => {
    const setRoundPlayer = vi.fn();

    render(
      <RoundPlayerDisplay
        roundPlayer={{ id: 0, name: "Alice" }}
        setRoundPlayer={setRoundPlayer}
      />,
    );

    expect(screen.getByText("Player:Alice")).toBeTruthy();
    screen.getByRole("button").click();

    expect(setRoundPlayer).toHaveBeenCalledWith(null);
  });
});
