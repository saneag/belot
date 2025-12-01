import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useLocalization } from '@/localizations/useLocalization';
import { useGameStore } from '@/store/game';

interface ResetButtonProps {
  resetValidation: VoidFunction;
}

export default function ResetButton({ resetValidation }: ResetButtonProps) {
  const resetMsg = useLocalization('players.reset');

  const resetGameStore = useGameStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    resetGameStore();
    resetValidation();
  }, [resetGameStore, resetValidation]);

  return (
    <Button mode="contained-tonal" onPress={handleReset}>
      {resetMsg}
    </Button>
  );
}
