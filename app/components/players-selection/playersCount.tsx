import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { usePlayersStore } from '../../store/players';

const PLAYERS_COUNT = [2, 3, 4];

export default function PlayersCount() {
  const playersCount = usePlayersStore((state) => state.playersCount);
  const setPlayersCount = usePlayersStore((state) => state.setPlayersCount);
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const theme = useTheme();

  const handlePlayersCountChange = (count: number) => {
    if (count === 2) {
      setPlayersNames({
        '2': '',
        '3': '',
      });
    } else if (count === 3) {
      setPlayersNames({
        '3': '',
      });
    }

    setPlayersCount(count);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of players</Text>
      <View style={styles.playersCountContainer}>
        {PLAYERS_COUNT.map((count) => (
          <Button
            key={count}
            style={
              playersCount === count && {
                backgroundColor: theme.colors.inversePrimary,
              }
            }
            mode='elevated'
            onPress={() => handlePlayersCountChange(count)}>
            {count}
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
  },
  playersCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  selectedPlayersCount: {
    backgroundColor: '#3ccc37ff',
  },
});
