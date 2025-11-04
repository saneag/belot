import { useRouter } from 'expo-router';
import { Dispatch, SetStateAction } from 'react';
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

interface SubmitButtonProps {
  setValidations: Dispatch<SetStateAction<PlayersNamesValidation>>;
}

export default function SubmitButton({ setValidations }: SubmitButtonProps) {
  const router = useRouter();

  const initGame = useGameStore((state) => state.initScore);
  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);

  const handleSubmit = async () => {
    const validation = validatePlayersNames(playersNames, playersCount);

    setValidations(validation);

    if (isPlayerNameValid(validation)) {
      await setMultipleItemsToStorage({
        [StorageKeys.playersCount]: playersCount,
        [StorageKeys.playersNames]: playersNames,
        [StorageKeys.hasPreviousGame]: true,
      });
      initGame(playersCount);
      router.navigate('/game-table');
    }
  };

  return (
    <Button
      mode='contained'
      onPress={handleSubmit}>
      Submit
    </Button>
  );
}
