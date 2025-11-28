import { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useLocalizations } from '../../../localizations/useLocalization';
import { useGameStore } from '../../../store/game';
import ConfirmationDialog from '../../confirmation-dialog';

export default function SkipRoundButton() {
  const messages = useLocalizations([
    { key: 'skip.round.title' },
    { key: 'skip.round.content' },
  ]);

  const setEmptyRoundScore = useGameStore((state) => state.setEmptyRoundScore);

  const handleAddEmptyRow = useCallback(() => {
    setEmptyRoundScore();
  }, [setEmptyRoundScore]);

  return (
    <ConfirmationDialog
      title={messages.skipRoundTitle}
      content={messages.skipRoundContent}
      renderShowDialog={(showDialog) => (
        <Button mode="outlined" onPress={showDialog}>
          {messages.skipRoundTitle}
        </Button>
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
