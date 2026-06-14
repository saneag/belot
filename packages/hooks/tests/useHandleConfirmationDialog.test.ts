import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  internalVisible: false,
  setInternalVisible: vi.fn(),
  externalVisible: undefined as boolean | undefined,
  setExternalVisible: vi.fn(),
}));

vi.mock("react", () => ({
  useCallback: (callback: (...args: unknown[]) => unknown) => callback,
  useState: () => [mocks.internalVisible, mocks.setInternalVisible],
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    confirmationDialogConfirmButton: "Confirm",
    confirmationDialogCancelButton: "Cancel",
  }),
}));

describe("useHandleConfirmationDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.internalVisible = false;
    mocks.externalVisible = undefined;
  });

  it("uses internal visibility state by default", async () => {
    mocks.internalVisible = true;

    const { useHandleConfirmationDialog } = await import("../src/useHandleConfirmationDialog");
    const result = useHandleConfirmationDialog({});

    expect(result.isVisible).toBe(true);
    expect(result.messages.confirmationDialogConfirmButton).toBe("Confirm");
  });

  it("uses external visibility state when provided", async () => {
    mocks.externalVisible = true;

    const { useHandleConfirmationDialog } = await import("../src/useHandleConfirmationDialog");
    const result = useHandleConfirmationDialog({
      visible: mocks.externalVisible,
      setVisible: mocks.setExternalVisible,
    });

    result.showDialog();
    expect(mocks.setExternalVisible).toHaveBeenCalledWith(true);
  });

  it("runs optional callback when showing dialog", async () => {
    const additionalCallback = vi.fn();

    const { useHandleConfirmationDialog } = await import("../src/useHandleConfirmationDialog");
    const { showDialog } = useHandleConfirmationDialog({});

    showDialog(additionalCallback);

    expect(additionalCallback).toHaveBeenCalledOnce();
    expect(mocks.setInternalVisible).toHaveBeenCalledWith(true);
  });

  it("confirms and cancels with callbacks", async () => {
    const confirmationCallback = vi.fn();
    const cancelCallback = vi.fn();

    const { useHandleConfirmationDialog } = await import("../src/useHandleConfirmationDialog");
    const { handleDialogConfirmation, handleDialogCancel, hideDialog } = useHandleConfirmationDialog({
      confirmationCallback,
      cancelCallback,
    });

    hideDialog();
    expect(mocks.setInternalVisible).toHaveBeenCalledWith(false);

    await handleDialogConfirmation();
    expect(confirmationCallback).toHaveBeenCalledOnce();
    expect(mocks.setInternalVisible).toHaveBeenCalledWith(false);

    await handleDialogCancel();
    expect(cancelCallback).toHaveBeenCalledOnce();
    expect(mocks.setInternalVisible).toHaveBeenCalledWith(false);
  });
});
