import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../../helpers/themeHelpers';
import { useGameStore } from '../../../store/game';
import { usePlayersStore } from '../../../store/players';

interface RoundPlayerProps {
  roundPlayer: string;
  setRoundPlayer: Dispatch<SetStateAction<string>>;
}

export default function RoundPlayer({
  roundPlayer,
  setRoundPlayer,
}: RoundPlayerProps) {
  const { colors } = useAppTheme();

  const playersNames = usePlayersStore((state) => state.playersNames);
  const roundPlayers = useGameStore((state) => state.roundPlayers);
  const currentRound = useGameStore((state) => state.currentRound);

  const stateRoundPlayer = useMemo(
    () => roundPlayers[currentRound],
    [currentRound, roundPlayers]
  );

  const handleRemoveRoundPlayer = useCallback(() => {
    setRoundPlayer('');
  }, [setRoundPlayer]);

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
      }}>
      <Text
        style={{
          color: colors.error,
          fontWeight: 'bold',
        }}>
        {playersNames[stateRoundPlayer] ?? playersNames[roundPlayer]} played
        this round
      </Text>
      {!playersNames[stateRoundPlayer] && (
        <IconButton
          icon='pencil'
          iconColor='#001affff'
          mode='contained-tonal'
          size={16}
          style={{ padding: 0 }}
          onPress={handleRemoveRoundPlayer}
        />
      )}
    </View>
  );
}
