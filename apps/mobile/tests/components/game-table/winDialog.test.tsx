// @vitest-environment jsdom
import { GameMode } from "@belot/types";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  markForReset: vi.fn(),
  winner: { id: 0, name: "Alice" },
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ replace: mocks.replace, push: vi.fn(), back: vi.fn() }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    winDialogTitlePlayer: "Player Alice wins",
    winDialogTitleTeam: "Team wins",
    winDialogContent: "Congratulations",
  }),
  useLocalization: () => "Reset game",
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { mode: GameMode; markForReset: () => void }) => unknown) =>
    selector({ mode: GameMode.classic, markForReset: mocks.markForReset }),
}));

vi.mock("@/helpers/storageHelpers", () => ({
  removeFromStorage: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useHandleConfirmationDialog: ({
    visible,
    setVisible,
    confirmationCallback,
    cancelCallback,
  }: {
    visible?: boolean;
    setVisible?: (v: boolean) => void;
    confirmationCallback?: () => void;
    cancelCallback?: () => void;
  }) => ({
    isVisible: visible ?? false,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: vi.fn(),
    hideDialog: () => setVisible?.(false),
    handleDialogCancel: () => {
      cancelCallback?.();
      setVisible?.(false);
    },
    handleDialogConfirmation: () => {
      confirmationCallback?.();
      setVisible?.(false);
    },
  }),
}));

describe("WinDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows win dialog when winner is set", async () => {
    const { default: WinDialog } = await import("@/components/game-table/winDialog");
    const setWinner = vi.fn();

    const { rerender } = render(<WinDialog winner={null} setWinner={setWinner} />);

    rerender(<WinDialog winner={mocks.winner} setWinner={setWinner} />);

    await waitFor(() => {
      expect(screen.getByText("Player Alice wins")).toBeTruthy();
    });
  });
});

describe("ResetGameButton", () => {
  it("resets game and navigates home", async () => {
    const setWinner = vi.fn();
    const { default: ResetGameButton } =
      await import("@/components/game-table/action-buttons/resetGame");

    render(<ResetGameButton setWinner={setWinner} />);
    fireEvent.click(screen.getByRole("button", { name: "Reset game" }));

    expect(setWinner).toHaveBeenCalledWith(null);
    expect(mocks.markForReset).toHaveBeenCalled();
    expect(mocks.replace).toHaveBeenCalledWith("/starting-screen");
  });
});
