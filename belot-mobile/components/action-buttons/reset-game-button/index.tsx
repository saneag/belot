import { useRouter } from 'expo-router';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useLocalization } from '@/localizations/useLocalization';
import { useGameStore, Player, Team } from '@belot/shared';

interface ResetGameButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ResetGameButton({ setWinner }: ResetGameButtonProps) {
  const router = useRouter();

  const resetGameButtonMsg = useLocalization('game.reset.submit.button');

  const reset = useGameStore((state) => state.reset);

  const handleReset = useCallback(() => {
    reset();
    setWinner(null);
    router.back();
  }, [reset, router, setWinner]);

  return (
    <Button mode="contained" onPress={handleReset}>
      {resetGameButtonMsg}
    </Button>
  );
}
