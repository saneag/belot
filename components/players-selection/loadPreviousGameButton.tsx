import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useLoadPlayersNames } from '../../hooks/useLoadPlayersNames';
import { useGameStore } from '../../store/game';

export default function LoadPreviousGameButton() {
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
      Load previous game
    </Button>
  );
}
