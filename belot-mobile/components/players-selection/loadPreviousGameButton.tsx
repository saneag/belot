import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useLoadPlayersNames } from '@/hooks/useLoadPlayersNames';
import { useLocalization } from '@/localizations/useLocalization';
import { useGameStore } from '@belot/shared';

export default function LoadPreviousGameButton() {
  const buttonMsg = useLocalization('load.previous.game.button');

  const hasPreviousGame = useGameStore((state) => state.hasPreviousGame);
  const loadPlayersNames = useLoadPlayersNames();

  const handleLoadPreviousGame = useCallback(async () => {
    await loadPlayersNames();
  }, [loadPlayersNames]);

  if (!hasPreviousGame) {
    return null;
  }

  return (
    <Button icon="reload" mode="outlined" onPress={handleLoadPreviousGame}>
      {buttonMsg}
    </Button>
  );
}
