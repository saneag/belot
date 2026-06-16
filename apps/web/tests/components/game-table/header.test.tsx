// @vitest-environment jsdom
import { MemoryRouter } from "react-router-dom";

import Header from "@/components/game-table/header";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const handleReset = vi.fn();
const setShowDialog = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("@belot/components", () => ({
  CurrentDealer: () => <div>Current dealer</div>,
  TimeTracker: () => <div>Time tracker</div>,
}));

vi.mock("@belot/hooks", () => ({
  useHandleGameReset: () => ({
    showDialog: false,
    setShowDialog,
    handleReset,
  }),
}));

vi.mock("@belot/localizations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/localizations")>();
  return {
    ...actual,
    useLocalizations: () => ({
      gameResetTitle: "Reset game",
      gameResetContent: "Are you sure?",
      dealer: "Dealer",
    }),
  };
});

vi.mock("@/hooks/usePreventBackPress", () => ({
  usePreventBackPress: (callback: () => void) => {
    callback();
    return {
      state: "unblocked",
      reset: vi.fn(),
      proceed: vi.fn(),
      location: undefined,
    };
  },
}));

vi.mock("@/components/confirmationDialog", () => ({
  default: ({
    renderShowDialog,
    confirmationCallback,
  }: {
    renderShowDialog: (showDialog: () => void) => React.ReactNode;
    confirmationCallback: () => void;
  }) => (
    <div>
      {renderShowDialog(vi.fn())}
      <button type="button" onClick={confirmationCallback}>
        Confirm reset
      </button>
    </div>
  ),
}));

describe("Header", () => {
  it("renders dealer, timer, reset dialog, and opens dialog from back button", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Current dealer")).toBeTruthy();
    expect(screen.getByText("Time tracker")).toBeTruthy();
    expect(setShowDialog).toHaveBeenCalledWith(true);

    screen.getAllByRole("button")[0]?.click();
    screen.getByRole("button", { name: "Confirm reset" }).click();

    expect(handleReset).toHaveBeenCalled();
  });
});
