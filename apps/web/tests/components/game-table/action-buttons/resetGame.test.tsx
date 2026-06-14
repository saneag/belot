// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ResetGameButton from "@/components/game-table/action-buttons/resetGame";

const reset = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Reset game",
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { reset: typeof reset }) => unknown) => selector({ reset }),
}));

describe("ResetGameButton", () => {
  it("resets game and navigates home", () => {
    const setWinner = vi.fn();

    render(
      <MemoryRouter>
        <ResetGameButton setWinner={setWinner} />
      </MemoryRouter>,
    );

    screen.getByRole("button", { name: "Reset game" }).click();

    expect(reset).toHaveBeenCalled();
    expect(setWinner).toHaveBeenCalledWith(null);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
