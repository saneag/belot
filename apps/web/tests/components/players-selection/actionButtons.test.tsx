import ActionButtons from "@/components/players-selection/actionButtons";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const handleReset = vi.fn();
const handleOpenDialog = vi.fn();
const handleSubmit = vi.fn();

vi.mock("@belot/hooks", () => ({
  useHandlePlayersSelectionResetButton: () => handleReset,
  usePlayersSubmit: () => ({
    handleOpenDialog,
    handleSubmit,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string) => key,
  useLocalizations: () => ({
    playersSubmitDialogTitle: "Submit",
    playersSubmitDialogButton: "Start game",
    serverOffline: "Server offline",
  }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

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
      <button type="button" onClick={() => confirmationCallback()}>
        Confirm submit
      </button>
    </div>
  ),
}));

vi.mock("@/components/players-selection/dealerSelectDialogContent", () => ({
  default: () => <div>Dealer select</div>,
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

describe("ActionButtons", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders reset and submit buttons", () => {
    render(<ActionButtons />);

    screen.getByRole("button", { name: "players.reset" }).click();
    screen.getByRole("button", { name: "Start game" }).click();

    expect(handleReset).toHaveBeenCalled();
    expect(handleOpenDialog).toHaveBeenCalled();
  });

  it("submits players when dialog is confirmed", () => {
    render(<ActionButtons />);

    screen.getAllByRole("button", { name: "Confirm submit" })[0]?.click();

    expect(handleSubmit).toHaveBeenCalled();
  });
});
