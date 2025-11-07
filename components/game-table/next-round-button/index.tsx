import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useGameStore } from '../../../store/game';
import { usePlayersStore } from '../../../store/players';
import ConfirmationDialog from '../../confirmation-dialog';

export default function NextRoundButton() {
  const playersCount = usePlayersStore((state) => state.playersCount);

  const setNextScore = useGameStore((state) => state.setNextScore);

  const handleAddEmptyRow = useCallback(() => {
    setNextScore(playersCount);
  }, [playersCount, setNextScore]);

  return (
    <ConfirmationDialog
      title=''
      content=''
      renderShowDialog={(showDialog) => (
        <Button
          mode='contained'
          onPress={showDialog}>
          Next round
        </Button>
      )}
      confirmationCallback={handleAddEmptyRow}
      cancelCallback={() => {}}
      primaryButton='confirm'
    />
  );
}
