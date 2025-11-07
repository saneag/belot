import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import NextRoundButton from './next-round-button';
import TableBody from './table-body';
import TableHeader from './tableHeader';

export default function GameTable() {
  const { height } = useWindowDimensions();
  const theme = useTheme();

  return (
    <View style={style.container}>
      <View
        style={[
          style.tableContainer,
          { maxHeight: height - 170, borderColor: theme.colors.primary },
        ]}>
        <TableHeader />
        <TableBody />
      </View>
      <NextRoundButton />
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
});
