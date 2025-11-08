import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { usePlayersStore } from '../../store/players';

export default function CurrentDealer() {
  const playersNames = usePlayersStore((state) => state.playersNames);
  const dealer = usePlayersStore((state) => state.dealer);

  return <Text style={style.dealer}>Dealer: {playersNames[dealer]}</Text>;
}

const style = StyleSheet.create({
  dealer: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
