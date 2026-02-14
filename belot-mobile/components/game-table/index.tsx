import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Player, Team } from '@belot/shared';
import ResetGameButton from '../action-buttons/reset-game-button';
import NextRoundButton from '../action-buttons/next-round-button';
import SkipRoundButton from '../action-buttons/skip-round-button';
import TableBody from './table-body';
import TableHeader from './tableHeader';
import WinDialog from '../win-dialog';
import UndoRoundButton from '../action-buttons/undo-round-button';
import RedoRoundButton from '../action-buttons/redo-round-button';

const CONTAINER_MARGIN_BOTTOM = 20;

export default function GameTable() {
  const { height } = useWindowDimensions();
  const theme = useTheme();

  const [winner, setWinner] = useState<Player | Team | null>(null);

  return (
    <View style={style.container}>
      <View
        style={[
          style.tableContainer,
          {
            maxHeight: height - 165 - CONTAINER_MARGIN_BOTTOM,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <TableHeader />
        <TableBody />
      </View>
      {winner ? (
        <ResetGameButton setWinner={setWinner} />
      ) : (
        <View style={style.actionButtons}>
          <UndoRoundButton />
          <RedoRoundButton />
          <SkipRoundButton />
          <NextRoundButton setWinner={setWinner} />
        </View>
      )}

      <WinDialog winner={winner} setWinner={setWinner} />
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
  tableContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 5,
    flexWrap: 'wrap',
  },
});
