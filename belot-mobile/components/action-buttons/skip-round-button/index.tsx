import { useCallback } from 'react';
import { IconButton, Tooltip } from 'react-native-paper';
import { useLocalizations } from '@/localizations/useLocalization';
import { useGameStore } from '@belot/shared';
import ConfirmationDialog from '../../confirmation-dialog';

export default function SkipRoundButton() {
  const messages = useLocalizations([
    { key: 'skip.round.title' },
    { key: 'skip.round.content' },
  ]);

  const skipRound = useGameStore((state) => state.skipRound);

  const handleAddEmptyRow = useCallback(() => {
    skipRound();
  }, [skipRound]);

  return (
    <ConfirmationDialog
      title={messages.skipRoundTitle}
      content={messages.skipRoundContent}
      renderShowDialog={(showDialog) => (
        <Tooltip title={messages.skipRoundTitle}>
          <IconButton
            mode="outlined"
            icon="chevron-double-right"
            onPress={showDialog}
          />
        </Tooltip>
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
