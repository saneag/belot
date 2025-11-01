import { StyleSheet, useWindowDimensions, View } from 'react-native';
import NewRow from './newRow';
import TableBody from './table-body';
import TableHeader from './tableHeader';

export default function GameTable() {
  const { height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={[styles.tableContainer, { maxHeight: height - 170 }]}>
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
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
