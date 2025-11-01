import { StorageKeys } from '@/constants/storageKeys';
import { useLoadPlayersNames } from '@/hooks/useLoadPlayersNames';
import { usePlayersStore } from '@/store/players';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { removeFromStorage, setToStorage } from '../../helpers/storageHelpers';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';

export default function PlayersSelection() {
  const playersNames = usePlayersStore((state) => state.playersNames);
  const resetPlayersStore = usePlayersStore((state) => state.reset);

  const handleReset = async () => {
    resetPlayersStore();
    await removeFromStorage(StorageKeys.playersNames);
  };

  const handleSubmit = async () => {
    await setToStorage(StorageKeys.playersNames, playersNames);
  };

  useLoadPlayersNames();

  return (
    <>
      <Text style={styles.header}>Setup</Text>

      <View style={styles.form}>
        <PlayersCount />
        <PlayersNames />

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
