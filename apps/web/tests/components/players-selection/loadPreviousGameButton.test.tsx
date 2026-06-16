// @vitest-environment jsdom
import LoadPreviousGameButton from "@/components/players-selection/loadPreviousGameButton";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const loadPlayersNamesFromStorage = vi.fn();
const fetchPreviousPlayers = vi.fn();

const previousPlayersMocks = vi.hoisted(() => ({
  storagePlayers: [{ id: 0, name: "Alice" }] as { id: number; name: string }[] | null,
}));

vi.mock("@belot/hooks", () => ({
  useLoadPreviousPlayers: () => ({
    storagePlayers: previousPlayersMocks.storagePlayers,
    fetchPreviousPlayers,
    loadPlayersNamesFromStorage,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Load previous game",
}));

describe("LoadPreviousGameButton", () => {
  it("loads previous players when clicked", () => {
    previousPlayersMocks.storagePlayers = [{ id: 0, name: "Alice" }];

    render(<LoadPreviousGameButton />);

    expect(fetchPreviousPlayers).toHaveBeenCalled();
    screen.getByRole("button", { name: "Load previous game" }).click();

    expect(loadPlayersNamesFromStorage).toHaveBeenCalled();
  });

  it("renders nothing when no stored players exist", () => {
    previousPlayersMocks.storagePlayers = null;

    const { container } = render(<LoadPreviousGameButton />);

    expect(container.textContent).toBe("");
  });
});
