import React, { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from "react";

import { Keyboard, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";

import { useKeyboardAvoidView } from "@/hooks/useKeyboardAvoidView";
import { useLocalizations } from "@/localizations/useLocalization";

import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

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
  const bottom = useKeyboardAvoidView();

  const messages = useLocalizations([
    { key: "confirmation.dialog.confirm.button" },
    { key: "confirmation.dialog.cancel.button" },
  ]);

  const isVisible = visible ?? internalIsVisible;
  const setIsVisible = setVisible ?? setInternalIsVisible;

  const showDialog = useCallback(() => {
    Keyboard.dismiss();
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

  const buttonMode: Record<string, "primary" | "secondary"> =
    primaryButton === "confirm"
      ? {
          confirm: "primary",
          cancel: "secondary",
        }
      : {
          confirm: "secondary",
          cancel: "primary",
        };

  const Container = useMemo(() => (asChild ? React.Fragment : View), [asChild]);
  const containerStyle = asChild ? {} : { style: { zIndex: 1, elevation: 1 } };

  return (
    <Container {...containerStyle}>
      {renderShowDialog(showDialog)}

      <Modal isOpen={isVisible} onClose={hideDialog} style={{ bottom }}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            {typeof title === "string" ? <Heading>{title}</Heading> : title}
          </ModalHeader>
          <ModalBody>{typeof content === "string" ? <Text>{content}</Text> : content}</ModalBody>
          <ModalFooter>
            {isConfirmationButtonVisible && (
              <Button
                action={buttonMode.confirm}
                onPress={handleDialogConfirmation}
                disabled={isConfirmButtonDisabled}
              >
                <ButtonText>{messages.confirmationDialogConfirmButton}</ButtonText>
              </Button>
            )}
            <Button action={buttonMode.cancel} onPress={handleDialogCancel} className="px-4">
              <ButtonText>{messages.confirmationDialogCancelButton}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
