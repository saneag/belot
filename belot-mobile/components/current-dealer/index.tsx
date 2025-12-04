import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalization } from '@/localizations/useLocalization';
import { useGameStore } from '@belot/shared';

export default function CurrentDealer() {
  const dealer = useGameStore((state) => state.dealer);

  const dealerMsg = useLocalization('dealer', [dealer?.name]);

  return <Text style={style.dealer}>{dealerMsg}</Text>;
}

const style = StyleSheet.create({
  dealer: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
