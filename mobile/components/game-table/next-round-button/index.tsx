import { Dispatch, SetStateAction } from 'react';
import { Button } from 'react-native-paper';
import { useHandleNextRound } from '../../../hooks/useHandleNextRound';
import { useLocalizations } from '../../../localizations/useLocalization';
import { Player, Team } from '../../../types/game';
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
        <Button mode="contained" onPress={() => handleDialogOpen(showDialog)}>
          {messages.nextRoundButton}
        </Button>
      )}
      isConfirmationButtonVisible={!!rest.roundPlayer}
      confirmationCallback={handleNextRound}
      cancelCallback={handleCancel}
    />
  );
}
