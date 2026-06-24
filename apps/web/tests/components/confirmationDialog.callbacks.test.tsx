import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const dialogMocks = vi.hoisted(() => ({
  setIsVisible: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useHandleConfirmationDialog: () => ({
    isVisible: true,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: vi.fn(),
    handleDialogCancel: vi.fn(),
    handleDialogConfirmation: vi.fn(),
    setIsVisible: dialogMocks.setIsVisible,
  }),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    onOpenChange,
  }: {
    children: React.ReactNode;
    onOpenChange: (isOpen: boolean) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onOpenChange(false)}>
        Close primitive
      </button>
      {children}
    </div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

describe("ConfirmationDialog callbacks", () => {
  it("forwards primitive open changes", async () => {
    const { default: ConfirmationDialog } = await import("@/components/confirmationDialog");

    render(
      <ConfirmationDialog
        title="Title"
        content="Content"
        renderShowDialog={() => <button type="button">Open</button>}
      />,
    );

    screen.getByRole("button", { name: "Close primitive" }).click();

    expect(dialogMocks.setIsVisible).toHaveBeenCalledWith(false);
  });
});
