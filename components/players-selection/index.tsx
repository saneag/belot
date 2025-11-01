import { StorageKeys } from '@/constants/storageKeys';
import { useLoadPlayersNames } from '@/hooks/useLoadPlayersNames';
import { usePlayersStore } from '@/store/players';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import {
  isPlayerNameValid,
  validatePlayersNames,
} from '../../helpers/playerNamesValidations';
import { removeFromStorage, setToStorage } from '../../helpers/storageHelpers';
import { useGameStore } from '../../store/game';
import { PlayersNamesValidation } from '../../types/validations';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';

export default function PlayersSelection() {
  const router = useRouter();

  const [validations, setValidations] = useState<PlayersNamesValidation>({
    emptyNames: [],
    repeatingNames: [],
  });

  const initGame = useGameStore((state) => state.initScore);
  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const resetPlayersStore = usePlayersStore((state) => state.reset);

  const resetValidation = useCallback(() => {
    setValidations({
      emptyNames: [],
      repeatingNames: [],
    });
  }, []);

  const handleReset = useCallback(async () => {
    resetPlayersStore();
    resetValidation();
    await removeFromStorage(StorageKeys.playersNames);
  }, [resetPlayersStore, resetValidation]);

  const handleSubmit = async () => {
    const validation = validatePlayersNames(playersNames, playersCount);

    setValidations(validation);

    if (isPlayerNameValid(validation)) {
      await setToStorage(StorageKeys.playersNames, playersNames);
      initGame(playersCount);
      router.navigate('/game-table');
    }
  };

  useLoadPlayersNames();

  return (
    <>
      <Text style={styles.header}>Setup</Text>

      <View style={styles.form}>
        <PlayersCount />
        <PlayersNames
          validations={validations}
          resetValidation={resetValidation}
        />

        <View style={styles.buttonsGroup}>
          <Button
            mode='contained-tonal'
            onPress={handleReset}>
            Reset
          </Button>
          <Button
            mode='contained'
            onPress={handleSubmit}>
            Submit
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
  },
  form: {
    gap: 20,
  },
  buttonsGroup: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
