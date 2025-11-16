import { usePlayersStore } from '@/store/players';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import {
  getPlayersCount,
  setEmptyPlayers,
} from '../../helpers/playerNamesHelpers';

interface PlayersCountProps {
  resetValidations: VoidFunction;
}

const PLAYERS_COUNT = [2, 3, 4];

export default function PlayersCount({ resetValidations }: PlayersCountProps) {
  const players = usePlayersStore((state) => state.players);
  const setPlayers = usePlayersStore((state) => state.setPlayers);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const theme = useTheme();

  const handlePlayersCountChange = (count: number) => {
    setPlayers(setEmptyPlayers(count));

    resetValidations();
  };

  useEffect(() => {
    if (playersCount === 0) {
      setPlayers(setEmptyPlayers());
    }
  }, [playersCount, setPlayers]);

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
