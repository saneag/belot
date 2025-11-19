import { useRouter } from 'expo-router';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Button } from 'react-native-paper';
import { StorageKeys } from '../../constants/storageKeys';
import {
  isPlayerNameValid,
  validatePlayersNames,
} from '../../helpers/playerNamesValidations';
import { setMultipleItemsToStorage } from '../../helpers/storageHelpers';
import { useGameStore } from '../../store/game';
import { PlayersNamesValidation } from '../../types/validations';
import ConfirmationDialog from '../confirmation-dialog';
import DealerSelectDialogContent from './dealerSelectDialogContent';

interface SubmitButtonProps {
  setValidations: Dispatch<SetStateAction<PlayersNamesValidation>>;
}

export default function SubmitButton({ setValidations }: SubmitButtonProps) {
  const router = useRouter();

  const players = useGameStore((state) => state.players);
  const setEmptyRoundScore = useGameStore((state) => state.setEmptyRoundScore);

  const handleOpenDialog = useCallback(
    (showDialog: VoidFunction) => {
      const validation = validatePlayersNames(players);

      setValidations(validation);

      if (!isPlayerNameValid(validation)) {
        return;
      }

      showDialog();
    },
    [players, setValidations]
  );

  const handleSubmit = useCallback(async () => {
    const validation = validatePlayersNames(players);

    setValidations(validation);

    if (!isPlayerNameValid(validation)) {
      return;
    }

    await setMultipleItemsToStorage({
      [StorageKeys.players]: players,
      [StorageKeys.hasPreviousGame]: true,
    });

    setEmptyRoundScore();

    router.navigate('/game-table');
  }, [players, router, setEmptyRoundScore, setValidations]);

  return (
    <ConfirmationDialog
      title="Select the dealer"
      content={<DealerSelectDialogContent />}
      renderShowDialog={(showDialog) => (
        <Button mode="contained" onPress={() => handleOpenDialog(showDialog)}>
          Submit
        </Button>
      )}
      confirmationCallback={handleSubmit}
      primaryButton="confirm"
    />
  );
}
