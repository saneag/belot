import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { getPlayersCount, useGameStore } from '@belot/shared';
import { useLocalization } from '@/localizations/useLocalization';

interface PlayersCountProps {
  resetValidations: VoidFunction;
}

const PLAYERS_COUNT = [3, 4];

export default function PlayersCount({ resetValidations }: PlayersCountProps) {
  const theme = useTheme();

  const numberOfPlayersMsg = useLocalization('players.count.number.of.players');

  const players = useGameStore((state) => state.players);
  const setEmptyPlayersNames = useGameStore(
    (state) => state.setEmptyPlayersNames
  );

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const handlePlayersCountChange = useCallback(
    (count: number) => {
      setEmptyPlayersNames(count);
      resetValidations();
    },
    [resetValidations, setEmptyPlayersNames]
  );

  useEffect(() => {
    if (playersCount === 0) {
      setEmptyPlayersNames(PLAYERS_COUNT[0]);
    }
  }, [playersCount, players, setEmptyPlayersNames]);

  return (
    <View style={style.container}>
      <Text style={style.label}>{numberOfPlayersMsg}</Text>
      <View style={style.playersCountContainer}>
        {PLAYERS_COUNT.map((count) => (
          <Button
            key={count}
            style={
              playersCount === count && {
                backgroundColor: theme.colors.inversePrimary,
              }
            }
            mode="elevated"
            onPress={() => handlePlayersCountChange(count)}
          >
            {count}
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
