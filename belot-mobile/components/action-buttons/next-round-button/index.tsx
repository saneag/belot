import { Dispatch, SetStateAction } from 'react';
import { IconButton, Tooltip } from 'react-native-paper';
import { useHandleNextRound } from '@/hooks/useHandleNextRound';
import { useLocalizations } from '@/localizations/useLocalization';
import { Player, Team } from '@belot/shared';
import ConfirmationDialog from '../../confirmation-dialog';
import ScoreDialogContent from './scoreDialogContent';

interface NextRoundButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function NextRoundButton({ setWinner }: NextRoundButtonProps) {
  const messages = useLocalizations([
    { key: 'next.round.title' },
    { key: 'next.round.button' },
  ]);

  const { handleNextRound, handleCancel, handleDialogOpen, ...rest } =
    useHandleNextRound({
      setWinner,
    });

  return (
    <ConfirmationDialog
      title={messages.nextRoundTitle}
      content={<ScoreDialogContent {...rest} />}
      renderShowDialog={(showDialog) => (
        <Tooltip title={messages.nextRoundTitle}>
          <IconButton
            mode="contained"
            icon="arrow-right"
            onPress={() => handleDialogOpen(showDialog)}
          />
        </Tooltip>
      )}
      isConfirmationButtonVisible={!!rest.roundPlayer}
      confirmationCallback={handleNextRound}
      cancelCallback={handleCancel}
      primaryButton={rest.roundPlayer ? 'confirm' : 'cancel'}
    />
  );
}
