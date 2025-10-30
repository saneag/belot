import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { storeKeys } from '../../constants/storeKeys';
import { useLoadPlayersNames } from '../../hooks/useLoadPlayersNames';
import { usePlayersStore } from '../../store/players';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';

export default function PlayersSelection() {
  const playersNames = usePlayersStore((state) => state.playersNames);
  const resetPlayersStore = usePlayersStore((state) => state.reset);

  const handleReset = async () => {
    resetPlayersStore();
    await AsyncStorage.removeItem(storeKeys.playersNames);
  };

  const handleSubmit = async () => {
    await AsyncStorage.setItem(
      storeKeys.playersNames,
      JSON.stringify(playersNames)
    );
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
