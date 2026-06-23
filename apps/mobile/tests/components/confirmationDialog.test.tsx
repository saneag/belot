import { useState } from "react";

import ConfirmationDialog from "@/components/confirmationDialog";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
    showDialog: (cb?: () => void) => {
      cb?.();
      setVisible?.(true);
    },
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

function TestDialog() {
  const [visible, setVisible] = useState(false);

  return (
    <ConfirmationDialog
      title="Title"
      content="Content"
      renderShowDialog={(show) => (
        <button type="button" onClick={show}>
          Open
        </button>
      )}
      confirmationCallback={vi.fn()}
      visible={visible}
      setVisible={setVisible}
    />
  );
}

describe("ConfirmationDialog", () => {
  it("shows dialog and handles confirm", () => {
    render(<TestDialog />);

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Content")).toBeTruthy();
  });

  it("renders custom title and content nodes", () => {
    render(
      <ConfirmationDialog
        title={<span>Custom title</span>}
        content={<span>Custom content</span>}
        renderShowDialog={(show) => (
          <button type="button" onClick={show}>
            Open
          </button>
        )}
        visible={true}
        setVisible={vi.fn()}
        primaryButton="confirm"
        asChild
      />,
    );

    expect(screen.getByText("Custom title")).toBeTruthy();
    expect(screen.getByText("Custom content")).toBeTruthy();
  });
});
