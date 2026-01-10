import { TABLE_HEIGHT, TABLE_WIDTH, useGameStore } from '@belot/shared';
import { StyleSheet, View } from 'react-native';
import { IconButton, Tooltip } from 'react-native-paper';
import { useLocalizations } from '../../localizations/useLocalization';

export default function PlayersRandomizer() {
  const messages = useLocalizations([{ key: 'shuffle.players' }]);

  const shufflePlayers = useGameStore((state) => state.shufflePlayers);

  return (
    <View style={style.container}>
      <Tooltip title={messages.shufflePlayers}>
        <IconButton
          icon="account-convert-outline"
          style={style.icon}
          onPress={shufflePlayers}
        />
      </Tooltip>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: TABLE_WIDTH,
    height: TABLE_HEIGHT,
  },
  icon: {
    marginEnd: 15,
  },
});
