import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '@/helpers/themeHelpers';
import { useGameStore } from '@/store/game';
import { Player } from '@/types/game';

export default function DealerSelectDialogContent() {
  const { colors } = useAppTheme();

  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const setDealer = useGameStore((state) => state.setDealer);

  const handleDealerChange = useCallback(
    (dealer: Player) => {
      setDealer(dealer);
    },
    [setDealer]
  );

  useEffect(() => {
    if (!dealer && players.length) {
      setDealer(players[0]);
    }
  }, [dealer, players, setDealer]);

  return (
    <View style={{ gap: 10 }}>
      {players.map((player) => (
        <Button
          key={player.id}
          onPress={() => handleDealerChange(player)}
          icon={player.id === dealer?.id ? 'check' : ''}
          textColor={player.id === dealer?.id ? '#000' : ''}
          mode="outlined"
          style={
            player.id === dealer?.id
              ? { backgroundColor: colors.successLight }
              : {}
          }
        >
          {player.name}
        </Button>
      ))}
    </View>
  );
}
