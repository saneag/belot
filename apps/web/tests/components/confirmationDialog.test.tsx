import ConfirmationDialog from "@/components/confirmationDialog";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const dialogMocks = vi.hoisted(() => ({
  isVisible: false,
  showDialog: vi.fn(),
  handleDialogCancel: vi.fn(),
  handleDialogConfirmation: vi.fn(),
  setIsVisible: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useHandleConfirmationDialog: () => ({
    isVisible: dialogMocks.isVisible,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: dialogMocks.showDialog,
    handleDialogCancel: dialogMocks.handleDialogCancel,
    handleDialogConfirmation: dialogMocks.handleDialogConfirmation,
    setIsVisible: dialogMocks.setIsVisible,
  }),
}));

describe("ConfirmationDialog", () => {
  it("renders trigger and dialog actions", () => {
    dialogMocks.isVisible = true;

    render(
      <ConfirmationDialog
        title="Delete game"
        content="Are you sure?"
        renderShowDialog={(showDialog) => (
          <button type="button" onClick={showDialog}>
            Open
          </button>
        )}
      />,
    );

    expect(screen.getByText("Open")).toBeTruthy();
    expect(screen.getByText("Delete game")).toBeTruthy();
    expect(screen.getByText("Are you sure?")).toBeTruthy();
    expect(screen.getByText("Confirm")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();

    fireEvent.click(screen.getByText("Open"));
    expect(dialogMocks.showDialog).toHaveBeenCalled();
  });

  it("calls dialog handlers and supports asChild layout", () => {
    dialogMocks.isVisible = true;

    render(
      <ConfirmationDialog
        title="Delete game"
        content="Are you sure?"
        asChild
        renderShowDialog={(showDialog) => (
          <button type="button" onClick={() => showDialog()}>
            Open
          </button>
        )}
      />,
    );

    screen.getByRole("button", { name: "Confirm" }).click();
    screen.getByRole("button", { name: "Cancel" }).click();

    expect(dialogMocks.handleDialogConfirmation).toHaveBeenCalled();
    expect(dialogMocks.handleDialogCancel).toHaveBeenCalled();
  });

  it("hides confirm button when configured", () => {
    dialogMocks.isVisible = true;

    render(
      <ConfirmationDialog
        title="Skip"
        content="Skip round?"
        isConfirmationButtonVisible={false}
        renderShowDialog={() => <button type="button">Skip</button>}
      />,
    );

    expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });

  it("supports confirm as the primary action", () => {
    dialogMocks.isVisible = true;

    render(
      <ConfirmationDialog
        title="Submit"
        content="Submit game?"
        primaryButton="confirm"
        renderShowDialog={() => <button type="button">Submit</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });
});
