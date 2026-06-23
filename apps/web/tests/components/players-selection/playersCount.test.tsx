import PlayersCount from "@/components/players-selection/playersCount";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const handlePlayersCountChange = vi.fn();

vi.mock("@belot/hooks", () => ({
  usePlayersCount: () => ({
    playersCount: 4,
    handlePlayersCountChange,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Number of players",
}));

describe("PlayersCount", () => {
  it("renders player count options and handles selection", () => {
    render(<PlayersCount />);

    expect(screen.getByText("Number of players")).toBeTruthy();
    screen.getByRole("button", { name: "3" }).click();

    expect(handlePlayersCountChange).toHaveBeenCalledWith(3);
  });
});
