import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useLoadPlayersNames } from '../../hooks/useLoadPlayersNames';
import { usePlayersStore } from '../../store/players';

export default function LoadPreviousGameButton() {
  const hasPreviousGame = usePlayersStore((state) => state.hasPreviousGame);
  const loadPlayersNames = useLoadPlayersNames();

  const handleLoadPreviousGame = useCallback(async () => {
    await loadPlayersNames();
  }, [loadPlayersNames]);

  if (!hasPreviousGame) {
    return null;
  }

  return (
    <Button
      icon='reload'
      mode='outlined'
      onPress={handleLoadPreviousGame}>
      Load previous game
    </Button>
  );
}
