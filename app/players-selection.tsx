import { StyleSheet, View } from 'react-native';
import PlayersSelection from '../components/players-selection';

export default function PlayersSelectionScreen() {
  return (
    <View style={styles.container}>
      <PlayersSelection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
