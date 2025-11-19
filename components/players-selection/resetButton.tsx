import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useGameStore } from '../../store/game';

interface ResetButtonProps {
  resetValidation: VoidFunction;
}

export default function ResetButton({ resetValidation }: ResetButtonProps) {
  const resetGameStore = useGameStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    resetGameStore();
    resetValidation();
  }, [resetGameStore, resetValidation]);

  return (
    <Button mode="contained-tonal" onPress={handleReset}>
      Reset
    </Button>
  );
}
