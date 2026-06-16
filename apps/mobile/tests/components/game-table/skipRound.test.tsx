// @vitest-environment jsdom
import { useState } from "react";

import ConfirmationDialog from "@/components/confirmationDialog";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/hooks", () => ({
  useHandleSkipRound: () => vi.fn(),
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

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    skipRoundTitle: "Skip round",
    skipRoundContent: "Skip content",
  }),
}));

function SkipRoundHarness() {
  const [visible, setVisible] = useState(false);

  return (
    <ConfirmationDialog
      title="Skip round"
      content="Skip content"
      renderShowDialog={(show) => (
        <button type="button" onClick={show}>
          Skip
        </button>
      )}
      confirmationCallback={vi.fn()}
      visible={visible}
      setVisible={setVisible}
    />
  );
}

describe("SkipRoundButton", () => {
  it("renders skip round confirmation flow", async () => {
    const { default: SkipRoundButton } =
      await import("@/components/game-table/action-buttons/skipRound");

    render(<SkipRoundButton />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("shows skip content in confirmation dialog", () => {
    render(<SkipRoundHarness />);
    fireEvent.click(screen.getByText("Skip"));
    expect(screen.getByText("Skip content")).toBeTruthy();
  });
});
