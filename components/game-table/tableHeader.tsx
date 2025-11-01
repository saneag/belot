import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { usePlayersStore } from '../../store/players';

export default function TableHeader() {
  const playersNames = usePlayersStore((state) => state.playersNames);

  const filteredPlayerNames = useMemo(
    () => Object.values(playersNames).filter(Boolean),
    [playersNames]
  );

  return (
    <View style={styles.container}>
      {filteredPlayerNames.map((playerName, index) => (
        <View
          key={index}
          style={[
            styles.playerNameContainer,
            index % 2 === 0 ? { borderRightWidth: 1 } : {},
          ]}>
          <Text style={styles.playerNameText}>{playerName}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  playerNameContainer: {
    flex: 1,
  },
  playerNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
