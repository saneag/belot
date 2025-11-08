import { usePlayersStore } from '@/store/players';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface PlayersCountProps {
  resetValidations: VoidFunction;
}

const PLAYERS_COUNT = [2, 3, 4];

export default function PlayersCount({ resetValidations }: PlayersCountProps) {
  const playersCount = usePlayersStore((state) => state.playersCount);
  const setPlayersCount = usePlayersStore((state) => state.setPlayersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const setPlayersNames = usePlayersStore((state) => state.setPlayersNames);

  const theme = useTheme();

  const handlePlayersCountChange = (count: number) => {
    setPlayersNames(
      Object.fromEntries(
        Object.entries(playersNames).filter(([key]) => Number(key) < count)
      )
    );

    setPlayersCount(count);
    resetValidations();
  };

  return (
    <View style={style.container}>
      <Text style={style.label}>Number of players</Text>
      <View style={style.playersCountContainer}>
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
            {count !== 4 ? count : '2vs2'}
          </Button>
        ))}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
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
