import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Button, ButtonProps, Dialog, Portal, Text } from 'react-native-paper';
import { useKeyboardAvoidView } from '../../hooks/useKeyboardAvoidView';
import { useLocalizations } from '../../localizations/useLocalization';

interface ConfirmationModalProps {
  title: ReactNode;
  content: ReactNode;
  renderShowDialog: (showDialog: VoidFunction) => ReactNode;
  confirmationCallback?: VoidFunction;
  cancelCallback?: VoidFunction;
  primaryButton?: 'confirm' | 'cancel';
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
  primaryButton = 'cancel',
  visible,
  setVisible,
  asChild = false,
  isConfirmButtonDisabled = false,
  isConfirmationButtonVisible = true,
}: ConfirmationModalProps) {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const bottom = useKeyboardAvoidView();

  const messages = useLocalizations([
    { key: 'confirmation.dialog.confirm.button' },
    { key: 'confirmation.dialog.cancel.button' },
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

  const buttonMode: Record<string, ButtonProps['mode']> =
    primaryButton === 'confirm'
      ? {
          confirm: 'contained',
          cancel: 'outlined',
        }
      : {
          confirm: 'outlined',
          cancel: 'contained',
        };

  const Container = useMemo(() => (asChild ? React.Fragment : View), [asChild]);
  const containerStyle = asChild ? {} : { style: { zIndex: 1, elevation: 1 } };

  return (
    <Container {...containerStyle}>
      {renderShowDialog(showDialog)}
      <Portal>
        <Dialog visible={isVisible} onDismiss={hideDialog} style={{ bottom }}>
          <Dialog.Title>
            {typeof title === 'string' ? <Text>{title}</Text> : title}
          </Dialog.Title>
          <Dialog.Content>
            {typeof content === 'string' ? <Text>{content}</Text> : content}
          </Dialog.Content>
          <Dialog.Actions>
            {isConfirmationButtonVisible && (
              <Button
                mode={buttonMode.confirm}
                onPress={handleDialogConfirmation}
                style={style.button}
                disabled={isConfirmButtonDisabled}
              >
                {messages.confirmationDialogConfirmButton}
              </Button>
            )}
            <Button
              mode={buttonMode.cancel}
              onPress={handleDialogCancel}
              style={style.button}
            >
              {messages.confirmationDialogCancelButton}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Container>
  );
}

const style = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
  },
});
