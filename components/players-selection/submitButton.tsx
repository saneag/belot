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
import { usePlayersStore } from '../../store/players';
import { PlayersNamesValidation } from '../../types/validations';
import ConfirmationDialog from '../confirmation-dialog';
import DealerSelectDialogContent from './dealerSelectDialogContent';

interface SubmitButtonProps {
  setValidations: Dispatch<SetStateAction<PlayersNamesValidation>>;
}

export default function SubmitButton({ setValidations }: SubmitButtonProps) {
  const router = useRouter();

  const initGame = useGameStore((state) => state.initScore);
  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const setDealer = usePlayersStore((state) => state.setDealer);

  const handleOpenDialog = useCallback(
    (showDialog: VoidFunction) => {
      const validation = validatePlayersNames(playersNames, playersCount);

      setValidations(validation);

      if (!isPlayerNameValid(validation)) {
        return;
      }

      showDialog();
    },
    [playersCount, playersNames, setValidations]
  );

  const handleSubmit = useCallback(async () => {
    const validation = validatePlayersNames(playersNames, playersCount);

    setValidations(validation);

    if (!isPlayerNameValid(validation)) {
      return;
    }

    await setMultipleItemsToStorage({
      [StorageKeys.playersCount]: playersCount,
      [StorageKeys.playersNames]: playersNames,
      [StorageKeys.hasPreviousGame]: true,
    });
    initGame(playersCount);
    router.navigate('/game-table');
  }, [initGame, playersCount, playersNames, router, setValidations]);

  return (
    <ConfirmationDialog
      title='Select the dealer'
      content={<DealerSelectDialogContent />}
      renderShowDialog={(showDialog) => (
        <Button
          mode='contained'
          onPress={() => handleOpenDialog(showDialog)}>
          Submit
        </Button>
      )}
      confirmationCallback={handleSubmit}
      cancelCallback={() => setDealer(0)}
      primaryButton='confirm'
    />
  );
}
