import { Dispatch, SetStateAction } from 'react';
import { Button } from 'react-native-paper';
import { useHandleNextRound } from '../../../hooks/useHandleNextRound';
import { Player, Team } from '../../../types/game';
import ConfirmationDialog from '../../confirmation-dialog';
import ScoreDialogContent from './scoreDialogContent';

interface NextRoundButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function NextRoundButton({ setWinner }: NextRoundButtonProps) {
  const { handleNextRound, handleCancel, ...rest } = useHandleNextRound({
    setWinner,
  });

  return (
    <ConfirmationDialog
      title="Enter score"
      content={<ScoreDialogContent {...rest} />}
      renderShowDialog={(showDialog) => (
        <Button mode="contained" onPress={showDialog}>
          Next round
        </Button>
      )}
      isConfirmationButtonVisible={!!rest.roundPlayer}
      confirmationCallback={handleNextRound}
      cancelCallback={handleCancel}
    />
  );
}
