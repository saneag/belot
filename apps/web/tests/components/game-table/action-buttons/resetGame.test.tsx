// @vitest-environment jsdom
import { MemoryRouter } from "react-router-dom";

import ResetGameButton from "@/components/game-table/action-buttons/resetGame";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("@belot/hooks", () => ({
  useGameReset: ({
    navigateFunction,
    onComplete,
  }: {
    navigateFunction: () => void;
    onComplete?: () => void;
  }) => ({
    handleReset: () => {
      navigateFunction();
      onComplete?.();
    },
  }),
}));

vi.mock("@/helpers/storageHelpers", () => ({
  removeItemsFromStorage: vi.fn(),
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

    expect(setWinner).toHaveBeenCalledWith(null);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
