// @vitest-environment jsdom

import { AppState } from "react-native";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  setShowDialog: vi.fn(),
  handleReset: vi.fn(),
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
  useHandleGameReset: () => ({
    showDialog: false,
    setShowDialog: mocks.setShowDialog,
    handleReset: mocks.handleReset,
  }),
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
    messages: { confirmationDialogConfirmButton: "Confirm", confirmationDialogCancelButton: "Cancel" },
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
  TimeTracker: () => <span>Timer</span>,
}));

vi.mock("@/hooks/usePreventBackPress", () => ({
  usePreventBackPress: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AppState.currentState).valueOf();
  });

  it("renders dealer and timer sections", async () => {
    const { default: Header } = await import("@/components/game-table/header");
    render(<Header />);

    expect(screen.getByText("Dealer")).toBeTruthy();
    expect(screen.getByText("Timer")).toBeTruthy();
  });

  it("renders reset back button", async () => {
    const { default: Header } = await import("@/components/game-table/header");
    render(<Header />);

    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
});
