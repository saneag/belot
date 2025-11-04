import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { usePlayersStore } from '../../store/players';

interface ResetButtonProps {
  resetValidation: VoidFunction;
}

export default function ResetButton({ resetValidation }: ResetButtonProps) {
  const resetPlayersStore = usePlayersStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    resetPlayersStore();
    resetValidation();
  }, [resetPlayersStore, resetValidation]);

  return (
    <Button
      mode='contained-tonal'
      onPress={handleReset}>
      Reset
    </Button>
  );
}
