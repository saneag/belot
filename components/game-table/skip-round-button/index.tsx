import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useGameStore } from '../../../store/game';
import { usePlayersStore } from '../../../store/players';
import ConfirmationDialog from '../../confirmation-dialog';

export default function SkipRoundButton() {
  const playersCount = usePlayersStore((state) => state.playersCount);
  const dealer = usePlayersStore((state) => state.dealer);
  const setDealer = usePlayersStore((state) => state.setDealer);

  const setNextScore = useGameStore((state) => state.setNextScore);

  const handleAddEmptyRow = useCallback(() => {
    setNextScore(playersCount);

    setDealer(dealer + 1 === playersCount ? 0 : dealer + 1);
  }, [dealer, playersCount, setDealer, setNextScore]);

  return (
    <ConfirmationDialog
      title='Skip round'
      content='Are you sure you want to skip the round?'
      renderShowDialog={(showDialog) => (
        <Button
          mode='outlined'
          onPress={showDialog}>
          Skip round
        </Button>
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
