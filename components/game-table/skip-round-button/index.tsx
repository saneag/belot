import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useGameStore } from '../../../store/game';
import { usePlayersStore } from '../../../store/players';
import ConfirmationDialog from '../../confirmation-dialog';

export default function SkipRoundButton() {
  const players = usePlayersStore((state) => state.players);
  const setNextDealer = usePlayersStore((state) => state.setNextDealer);

  const setNextScore = useGameStore((state) => state.setNextScore);

  const handleAddEmptyRow = useCallback(() => {
    setNextScore(players);
    setNextDealer();
  }, [players, setNextDealer, setNextScore]);

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
