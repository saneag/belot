import { Dispatch, SetStateAction, useCallback } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useLocalization } from '../../../localizations/useLocalization';
import { useGameStore } from '../../../store/game';
import { Player } from '../../../types/game';

export interface RoundPlayerSelectProps {
  roundPlayer: Player | null;
  setRoundPlayer: Dispatch<SetStateAction<Player | null>>;
}

export default function RoundPlayerSelect({
  setRoundPlayer,
}: RoundPlayerSelectProps) {
  const nextRoundPlayerMsg = useLocalization('next.round.player.select');

  const players = useGameStore((state) => state.players);

  const handleRoundPlayerChange = useCallback(
    (player: Player) => {
      setRoundPlayer(player);
    },
    [setRoundPlayer]
  );

  return (
    <View style={{ gap: 10 }}>
      <Text>{nextRoundPlayerMsg}</Text>
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
