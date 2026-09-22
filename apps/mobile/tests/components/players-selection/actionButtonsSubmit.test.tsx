import { ToastAndroid } from "react-native";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  handleOpenDialog: vi.fn(),
  handleSubmit: vi.fn(),
  handleReset: vi.fn(),
  handleDealerChange: vi.fn(),
  players: [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
  ],
  dealer: { id: 0, name: "Alice" },
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string) => key,
  useLocalizations: () => ({
    playersSubmitDialogTitle: "Submit title",
    playersSubmitDialogButton: "Submit",
    serverOffline: "Offline",
    playersReset: "players.reset",
  }),
}));

vi.mock("@belot/hooks", () => ({
  useHandlePlayersSelectionResetButton: () => mocks.handleReset,
  usePlayersSubmit: (args: { navigateFunction: () => void; handleCatchError: () => void }) => {
    args.navigateFunction();
    args.handleCatchError();
    return {
      handleOpenDialog: mocks.handleOpenDialog,
      handleSubmit: mocks.handleSubmit,
    };
  },
  useHandleDealerChange: () => ({
    players: mocks.players,
    dealer: mocks.dealer,
    handleDealerChange: mocks.handleDealerChange,
  }),
  useHandleConfirmationDialog: ({
    visible,
    setVisible,
    confirmationCallback,
  }: {
    visible?: boolean;
    setVisible?: (v: boolean) => void;
    confirmationCallback?: () => void;
  }) => ({
    isVisible: visible ?? false,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: (cb?: () => void) => {
      cb?.();
      setVisible?.(true);
    },
    hideDialog: () => setVisible?.(false),
    handleDialogCancel: () => setVisible?.(false),
    handleDialogConfirmation: () => {
      confirmationCallback?.();
      setVisible?.(false);
    },
  }),
}));

describe("actionButtons submit flow", () => {
  it("opens submit dialog and wires submit handlers", async () => {
    const { default: ActionButtons } = await import("@/components/players-selection/actionButtons");

    render(<ActionButtons />);
    fireEvent.click(screen.getByText("Submit"));
    expect(mocks.handleOpenDialog).toHaveBeenCalled();
    expect(ToastAndroid.showWithGravity).toHaveBeenCalled();
  });
});

describe("DealerSelectDialogContent", () => {
  it("selects dealer on press", async () => {
    const { default: DealerSelectDialogContent } =
      await import("@/components/players-selection/dealerSelectDialogContent");

    render(<DealerSelectDialogContent />);
    fireEvent.click(screen.getByText("Bob"));
    expect(mocks.handleDealerChange).toHaveBeenCalledWith(mocks.players[1]);
  });
});
