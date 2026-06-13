import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { useLocalizations } from "@belot/localizations";

interface UseHandleConfirmationDialogProps {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  confirmationCallback?: () => Promise<void> | void;
  cancelCallback?: () => Promise<void> | void;
}

export const useHandleConfirmationDialog = ({
  visible,
  setVisible,
  confirmationCallback,
  cancelCallback,
}: UseHandleConfirmationDialogProps) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);

  const isVisible = visible ?? internalIsVisible;
  const setIsVisible = setVisible ?? setInternalIsVisible;

  const messages = useLocalizations([
    { key: "confirmation.dialog.confirm.button" },
    { key: "confirmation.dialog.cancel.button" },
  ]);

  const showDialog = useCallback(
    (additionalCallback?: () => void) => {
      additionalCallback?.();
      setIsVisible(true);
    },
    [setIsVisible],
  );

  const hideDialog = useCallback(() => setIsVisible(false), [setIsVisible]);

  const handleDialogConfirmation = useCallback(async () => {
    await confirmationCallback?.();
    hideDialog();
  }, [confirmationCallback, hideDialog]);

  const handleDialogCancel = useCallback(async () => {
    await cancelCallback?.();
    hideDialog();
  }, [cancelCallback, hideDialog]);

  return {
    messages,
    isVisible,
    showDialog,
    hideDialog,
    handleDialogConfirmation,
    handleDialogCancel,
    setIsVisible,
  };
};
