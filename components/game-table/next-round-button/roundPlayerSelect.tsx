import { Dispatch, SetStateAction, useCallback } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { usePlayersStore } from '../../../store/players';

export interface RoundPlayerSelectProps {
  roundPlayer: string;
  setRoundPlayer: Dispatch<SetStateAction<string>>;
}

export default function RoundPlayerSelect({
  setRoundPlayer,
}: RoundPlayerSelectProps) {
  const playersNames = usePlayersStore((state) => state.playersNames);

  const handleDealerChange = useCallback(
    (playerIndex: string) => {
      setRoundPlayer(playerIndex);
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
        }}>
        {Object.entries(playersNames).map(([playerIndex, playerName]) => (
          <Button
            key={playerIndex}
            mode='outlined'
            onPress={() => handleDealerChange(playerIndex)}>
            {playerName}
          </Button>
        ))}
      </View>
    </View>
  );
}
