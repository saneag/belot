import { useCallback } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useGameStore } from '../../../store/game';
import { Player } from '../../../types/game';

export default function RoundPlayerSelect() {
  const players = useGameStore((state) => state.players);
  const setRoundPlayer = useGameStore((state) => state.setRoundPlayer);

  const handleRoundPlayerChange = useCallback(
    (player: Player) => {
      setRoundPlayer(player);
    },
    [setRoundPlayer]
  );

  return (
    <View style={{ gap: 10 }}>
      <Text>Who played?</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {players.map((player) => (
          <Button
            key={player.id}
            mode="outlined"
            onPress={() => handleRoundPlayerChange(player)}
          >
            {player.name}
          </Button>
        ))}
      </View>
    </View>
  );
}
