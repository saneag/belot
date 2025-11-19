import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../../helpers/themeHelpers';
import { useGameStore } from '../../../store/game';

export default function RoundPlayer() {
  const { colors } = useAppTheme();

  const roundPlayer = useGameStore((state) => state.roundPlayer);

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
        {roundPlayer?.name} played this round
      </Text>
      {!roundPlayer && (
        <IconButton
          icon="pencil"
          iconColor="#001affff"
          mode="contained-tonal"
          size={16}
          style={{ padding: 0 }}
          onPress={() => {}}
        />
      )}
    </View>
  );
}
