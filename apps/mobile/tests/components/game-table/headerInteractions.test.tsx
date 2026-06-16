// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  setShowDialog: vi.fn(),
  handleReset: vi.fn(),
  backPressCallback: null as (() => void) | null,
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ replace: mocks.replace, push: vi.fn(), back: vi.fn() }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    gameResetTitle: "Reset?",
    gameResetContent: "Are you sure?",
    dealer: "Dealer",
  }),
}));

vi.mock("@belot/hooks", () => ({
  useHandleGameReset: (args: { navigateFunction: () => void }) => {
    args.navigateFunction();
    return {
      showDialog: true,
      setShowDialog: mocks.setShowDialog,
      handleReset: mocks.handleReset,
    };
  },
  useHandleConfirmationDialog: ({
    confirmationCallback,
    visible,
    setVisible,
  }: {
    confirmationCallback?: () => void;
    visible?: boolean;
    setVisible?: (v: boolean) => void;
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

vi.mock("@belot/components", () => ({
  CurrentDealer: ({ dealerMessage }: { dealerMessage: string }) => <span>{dealerMessage}</span>,
  TimeTracker: ({
    isVisible,
    subscribeToVisibilityChange,
  }: {
    isVisible: () => boolean;
    subscribeToVisibilityChange: (handler: () => void) => () => void;
  }) => {
    subscribeToVisibilityChange(() => undefined);
    return <span>{isVisible() ? "active" : "inactive"}</span>;
  },
}));

vi.mock("@/hooks/usePreventBackPress", () => ({
  usePreventBackPress: (callback: () => void) => {
    mocks.backPressCallback = callback;
  },
}));

describe("Header interactions", () => {
  it("triggers back press handler and reset navigation", async () => {
    const { default: Header } = await import("@/components/game-table/header");
    render(<Header />);

    mocks.backPressCallback?.();
    expect(mocks.setShowDialog).toHaveBeenCalledWith(true);
    expect(mocks.replace).toHaveBeenCalledWith("/starting-screen");
    expect(screen.getByText("active")).toBeTruthy();
  });
});
