import { ReactNode, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface ConfirmationModalProps {
  title: ReactNode;
  content: ReactNode;
  renderShowDialog: (showDialog: VoidFunction) => ReactNode;
  confirmationCallback: VoidFunction;
  cancelCallback?: VoidFunction;
}

export default function ConfirmationDialog({
  title,
  content,
  renderShowDialog,
  confirmationCallback,
  cancelCallback,
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
              mode='outlined'
              onPress={handleDialogConfirmation}
              style={style.button}>
              Confirm
            </Button>
            <Button
              mode='contained'
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
