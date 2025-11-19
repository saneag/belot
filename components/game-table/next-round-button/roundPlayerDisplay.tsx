import { useCallback } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../../helpers/themeHelpers';
import { useGameStore } from '../../../store/game';
import { RoundPlayerSelectProps } from './roundPlayerSelect';

type RoundPlayerDisplayProps = RoundPlayerSelectProps;

export default function RoundPlayerDisplay({
  roundPlayer,
  setRoundPlayer,
}: RoundPlayerDisplayProps) {
  const { colors } = useAppTheme();

  const stateRoundPlayer = useGameStore((state) => state.roundPlayer);

  const handleRoundPlayerEdit = useCallback(() => {
    setRoundPlayer(null);
  }, [setRoundPlayer]);

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
      }}
    >
      <Text
        style={{
          color: colors.error,
          fontWeight: 'bold',
        }}
      >
        {stateRoundPlayer?.name ?? roundPlayer?.name} played this round
      </Text>
      {!stateRoundPlayer && (
        <IconButton
          icon="pencil"
          iconColor="#001affff"
          mode="contained-tonal"
          size={16}
          style={{ padding: 0 }}
          onPress={handleRoundPlayerEdit}
        />
      )}
    </View>
  );
}
