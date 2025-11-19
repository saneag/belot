import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useGameStore } from '../../store/game';

export default function CurrentDealer() {
  const dealer = useGameStore((state) => state.dealer);

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
