import { StyleSheet, View } from 'react-native';
import PlayersSelection from '@/components/players-selection';

export default function PlayersSelectionScreen() {
  return (
    <View style={style.container}>
      <PlayersSelection />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
