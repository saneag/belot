import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { StorageKeys } from '../../constants/storageKeys';
import { removeFromStorage } from '../../helpers/storageHelpers';
import { usePlayersStore } from '../../store/players';

interface ResetButtonProps {
  resetValidation: VoidFunction;
}

export default function ResetButton({ resetValidation }: ResetButtonProps) {
  const resetPlayersStore = usePlayersStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    resetPlayersStore();
    resetValidation();
    await removeFromStorage(StorageKeys.playersNames);
  }, [resetPlayersStore, resetValidation]);

  return (
    <Button
      mode='contained-tonal'
      onPress={handleReset}>
      Reset
    </Button>
  );
}
