import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useLocalizations } from "@/localizations/useLocalization";

interface ConfirmationModalProps {
  title: ReactNode;
  content: ReactNode;
  renderShowDialog: (showDialog: VoidFunction) => ReactNode;
  confirmationCallback?: VoidFunction;
  cancelCallback?: VoidFunction;
  primaryButton?: "confirm" | "cancel";
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  asChild?: boolean;
  isConfirmButtonDisabled?: boolean;
  isConfirmationButtonVisible?: boolean;
}

export default function ConfirmationDialog({
  title,
  content,
  renderShowDialog,
  confirmationCallback,
  cancelCallback,
  primaryButton = "cancel",
  visible,
  setVisible,
  asChild = false,
  isConfirmButtonDisabled = false,
  isConfirmationButtonVisible = true,
}: ConfirmationModalProps) {
  const [internalIsVisible, setInternalIsVisible] = useState(false);

  const messages = useLocalizations([
    { key: "confirmation.dialog.confirm.button" },
    { key: "confirmation.dialog.cancel.button" },
  ]);

  const isVisible = visible ?? internalIsVisible;
  const setIsVisible = setVisible ?? setInternalIsVisible;

  const showDialog = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  const hideDialog = useCallback(() => setIsVisible(false), [setIsVisible]);

  const handleDialogConfirmation = useCallback(() => {
    confirmationCallback?.();
    hideDialog();
  }, [confirmationCallback, hideDialog]);

  const handleDialogCancel = useCallback(() => {
    cancelCallback?.();
    hideDialog();
  }, [cancelCallback, hideDialog]);

  const Container = useMemo<React.ElementType>(() => (asChild ? React.Fragment : "div"), [asChild]);
  const containerProps = asChild ? {} : { className: "relative z-10" };

  return (
    <Container {...containerProps}>
      <Dialog open={isVisible} onOpenChange={setIsVisible}>
        <DialogTrigger asChild>{renderShowDialog(showDialog)}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {content}
          <DialogFooter>
            {isConfirmationButtonVisible && (
              <Button
                variant={primaryButton === "confirm" ? "default" : "secondary"}
                onClick={handleDialogConfirmation}
                disabled={isConfirmButtonDisabled}
              >
                {messages.confirmationDialogConfirmButton}
              </Button>
            )}
            <Button
              variant={primaryButton === "cancel" ? "default" : "secondary"}
              onClick={handleDialogCancel}
              className="px-4"
            >
              {messages.confirmationDialogCancelButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
