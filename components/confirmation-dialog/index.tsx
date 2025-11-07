import { ReactNode, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ButtonProps, Dialog, Portal, Text } from 'react-native-paper';

interface ConfirmationModalProps {
  title: ReactNode;
  content: ReactNode;
  renderShowDialog: (showDialog: VoidFunction) => ReactNode;
  confirmationCallback: VoidFunction;
  cancelCallback?: VoidFunction;
  primaryButton?: 'confirm' | 'cancel';
}

export default function ConfirmationDialog({
  title,
  content,
  renderShowDialog,
  confirmationCallback,
  cancelCallback,
  primaryButton = 'cancel',
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showDialog = useCallback(() => setIsVisible(true), []);

  const hideDialog = useCallback(() => setIsVisible(false), []);

  const handleDialogConfirmation = useCallback(() => {
    confirmationCallback();
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

  return (
    <View>
      {renderShowDialog(showDialog)}
      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={hideDialog}>
          <Dialog.Title>
            {typeof title === 'string' ? <Text>{title}</Text> : title}
          </Dialog.Title>
          <Dialog.Content>
            {typeof content === 'string' ? <Text>{content}</Text> : content}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode={buttonMode.confirm}
              onPress={handleDialogConfirmation}
              style={style.button}>
              Confirm
            </Button>
            <Button
              mode={buttonMode.cancel}
              onPress={handleDialogCancel}
              style={style.button}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
  },
});
