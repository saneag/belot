import { useCallback } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { usePlayersStore } from '../../../store/players';

export default function RoundPlayerSelect() {
  const players = usePlayersStore((state) => state.players);
  const setRoundPlayer = usePlayersStore((state) => state.setRoundPlayer);

  const handleRoundPlayerChange = useCallback(
    (playerId: number) => {
      setRoundPlayer(playerId);
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
            onPress={() => handleRoundPlayerChange(player.id)}
          >
            {player.name}
          </Button>
        ))}
      </View>
    </View>
  );
}
