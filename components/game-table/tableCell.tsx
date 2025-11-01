import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface TableCellProps {
  index: number;
  children: ReactNode;
}

export default function TableCell({ index, children }: TableCellProps) {
  return (
    <View
      style={[
        styles.playerNameContainer,
        index % 2 === 0 ? { borderRightWidth: 1 } : {},
      ]}>
      {typeof children === 'string' ? (
        <Text
          variant='headlineMedium'
          style={styles.playerNameText}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  playerNameContainer: {
    flex: 1,
  },
  playerNameText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
