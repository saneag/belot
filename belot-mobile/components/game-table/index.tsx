import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Player, Team } from '@belot/shared';
import ResetGameButton from '../reset-game-button';
import NextRoundButton from './next-round-button';
import SkipRoundButton from './skip-round-button';
import TableBody from './table-body';
import TableHeader from './tableHeader';
import WindDialog from './win-dialog';

export default function GameTable() {
  const { height } = useWindowDimensions();
  const theme = useTheme();

  const [winner, setWinner] = useState<Player | Team | null>(null);

  return (
    <View style={style.container}>
      <View
        style={[
          style.tableContainer,
          { maxHeight: height - 175, borderColor: theme.colors.primary },
        ]}
      >
        <TableHeader />
        <TableBody />
      </View>
      {winner ? (
        <ResetGameButton setWinner={setWinner} />
      ) : (
        <View style={style.actionButtons}>
          <SkipRoundButton />
          <NextRoundButton setWinner={setWinner} />
        </View>
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
    marginBottom: 10,
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
