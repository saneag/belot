import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../helpers/themeHelpers';
import { usePlayersStore } from '../../store/players';

export default function DealerSelectDialogContent() {
  const { colors } = useAppTheme();

  const playersNames = usePlayersStore((state) => state.playersNames);
  const playersCount = usePlayersStore((state) => state.playersCount);
  const dealer = usePlayersStore((state) => state.dealer);
  const setDealer = usePlayersStore((state) => state.setDealer);

  const players = useMemo(
    () => Array.from({ length: playersCount }),
    [playersCount]
  );

  const handleDealerChange = useCallback(
    (index: number) => {
      setDealer(index);
    },
    [setDealer]
  );

  return (
    <View style={{ gap: 10 }}>
      {players.map((_, index) => (
        <Button
          key={index}
          onPress={() => handleDealerChange(index)}
          icon={index === dealer ? 'check' : ''}
          textColor='#000'
          mode='outlined'
          style={
            dealer === index ? { backgroundColor: colors.successLight } : {}
          }>
          {playersNames[index]}
        </Button>
      ))}
    </View>
  );
}
