import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { getDealer } from '../../helpers/playerNamesHelpers';
import { useAppTheme } from '../../helpers/themeHelpers';
import { usePlayersStore } from '../../store/players';

export default function DealerSelectDialogContent() {
  const { colors } = useAppTheme();

  const players = usePlayersStore((state) => state.players);
  const setDealer = usePlayersStore((state) => state.setDealer);

  const dealer = useMemo(() => getDealer(players), [players]);

  const handleDealerChange = useCallback(
    (index: number) => {
      setDealer(index);
    },
    [setDealer]
  );

  return (
    <View style={{ gap: 10 }}>
      {players.map((player) => (
        <Button
          key={player.id}
          onPress={() => handleDealerChange(player.id)}
          icon={player.id === dealer?.id ? 'check' : ''}
          textColor='#000'
          mode='outlined'
          style={
            player.id === dealer?.id
              ? { backgroundColor: colors.successLight }
              : {}
          }>
          {player.name}
        </Button>
      ))}
    </View>
  );
}
