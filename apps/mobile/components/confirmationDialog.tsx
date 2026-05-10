import React, { Dispatch, ReactNode, SetStateAction, useMemo } from "react";

import { Keyboard, View } from "react-native";

import { useHandleConfirmationDialog } from "@belot/hooks";

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

import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

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
    hideDialog,
    handleDialogCancel,
    handleDialogConfirmation,
  } = useHandleConfirmationDialog(rest);

  const bottom = useKeyboardAvoidView();

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
      {renderShowDialog(() =>
        showDialog(() => {
          Keyboard.dismiss();
        }),
      )}

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
