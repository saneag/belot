import React, { type Dispatch, type ReactNode, type SetStateAction, useMemo } from "react";

import { useHandleConfirmationDialog } from "@belot/hooks";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  title: ReactNode;
  content: ReactNode;
  renderShowDialog: (showDialog: () => void) => ReactNode;
  confirmationCallback?: () => void;
  cancelCallback?: () => void;
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
  primaryButton = "cancel",
  asChild = false,
  isConfirmButtonDisabled = false,
  isConfirmationButtonVisible = true,
  ...rest
}: ConfirmationModalProps) {
  const {
    isVisible,
    messages,
    showDialog,
    handleDialogCancel,
    handleDialogConfirmation,
    setIsVisible,
  } = useHandleConfirmationDialog(rest);

  const Container = useMemo<React.ElementType>(() => (asChild ? React.Fragment : "div"), [asChild]);
  const containerProps = asChild ? {} : { className: "relative z-10" };

  return (
    <Container {...containerProps}>
      <Dialog open={isVisible} onOpenChange={(isOpen) => setIsVisible(isOpen)}>
        {renderShowDialog(showDialog)}
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
