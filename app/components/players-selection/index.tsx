import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PlayersCount from './playersCount';
import PlayersNames from './playersNames';

export default function PlayersSelection() {
  return (
    <>
      <Text style={styles.header}>Setup</Text>

      <View style={styles.form}>
        <PlayersCount />
        <PlayersNames />
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
  numberOfPlayersInput: {},
});
