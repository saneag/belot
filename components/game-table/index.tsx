import { StyleSheet, useWindowDimensions, View } from 'react-native';
import TableBody from './tableBody';
import TableHeader from './tableHeader';

export default function GameTable() {
  const { height } = useWindowDimensions();

  return (
    <View style={[styles.container, { maxHeight: height - 110 }]}>
      <View style={styles.tableContainer}>
        <TableHeader />
        <TableBody />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
