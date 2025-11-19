import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useGameStore } from '../../../store/game';
import ConfirmationDialog from '../../confirmation-dialog';

export default function SkipRoundButton() {
  const setEmptyRoundScore = useGameStore((state) => state.setEmptyRoundScore);

  const handleAddEmptyRow = useCallback(() => {
    setEmptyRoundScore();
  }, [setEmptyRoundScore]);

  return (
    <ConfirmationDialog
      title="Skip round"
      content="Are you sure you want to skip the round?"
      renderShowDialog={(showDialog) => (
        <Button mode="outlined" onPress={showDialog}>
          Skip round
        </Button>
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
