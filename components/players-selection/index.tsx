import { StorageKeys } from '@/constants/storageKeys';
import { useLoadPlayersNames } from '@/hooks/useLoadPlayersNames';
import { usePlayersStore } from '@/store/players';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { removeFromStorage, setToStorage } from '../../helpers/storageHelpers';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';

export default function PlayersSelection() {
  const router = useRouter();

  const [isFormValid, setIsFormValid] = useState(true);

  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const resetPlayersStore = usePlayersStore((state) => state.reset);

  const handleReset = useCallback(async () => {
    resetPlayersStore();
    await removeFromStorage(StorageKeys.playersNames);
  }, [resetPlayersStore]);

  const validatePlayersNames = useCallback(() => {
    return Object.entries(playersNames)
      .filter(([key]) => Number(key) < playersCount)
      .every(([_, value]) => value.trim());
  }, [playersCount, playersNames]);

  const handleSubmit = async () => {
    const isValid = validatePlayersNames();

    setIsFormValid(isValid);

    if (isValid) {
      await setToStorage(StorageKeys.playersNames, playersNames);
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
          isFormValid={isFormValid}
          setIsFormValid={setIsFormValid}
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
