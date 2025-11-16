import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getDealer } from '../../helpers/playerNamesHelpers';
import { usePlayersStore } from '../../store/players';

export default function CurrentDealer() {
  const players = usePlayersStore((state) => state.players);
  const dealer = useMemo(() => getDealer(players), [players]);

  return <Text style={style.dealer}>Dealer: {dealer?.name}</Text>;
}

const style = StyleSheet.create({
  dealer: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
