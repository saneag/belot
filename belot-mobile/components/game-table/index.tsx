import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Player, Team } from '@belot/shared';
import ResetGameButton from '../action-buttons/reset-game-button';
import TableBody from './table-body';
import TableHeader from './tableHeader';
import WindDialog from '../win-dialog';
import { useAppTheme } from '../../helpers/themeHelpers';
import ActionButtons from '../action-buttons';

const CONTAINER_MARGIN_BOTTOM = 20;

export default function GameTable() {
  const { height } = useWindowDimensions();
  const { colors } = useAppTheme();

  const [winner, setWinner] = useState<Player | Team | null>(null);

  return (
    <View style={style.container}>
      <View
        style={[
          style.tableWrapper,
          {
            maxHeight: height - 165 - CONTAINER_MARGIN_BOTTOM,
            borderColor: colors.primary,
          },
        ]}
      >
        <TableHeader />
        <TableBody />
      </View>
      {winner ? (
        <ResetGameButton setWinner={setWinner} />
      ) : (
        <ActionButtons setWinner={setWinner} />
      )}

      <WindDialog winner={winner} setWinner={setWinner} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: CONTAINER_MARGIN_BOTTOM,
  },
  tableWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
