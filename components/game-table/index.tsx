import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import NewRow from './newRow';
import TableBody from './table-body';
import TableHeader from './tableHeader';

export default function GameTable() {
  const { height } = useWindowDimensions();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tableContainer,
          { maxHeight: height - 170, borderColor: theme.colors.primary },
        ]}>
        <TableHeader />
        <TableBody />
      </View>
      <NewRow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: 'space-between',
  },
  tableContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
