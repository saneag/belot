import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface TableCellProps {
  index: number;
  children: ReactNode;
}

export default function TableCell({ index, children }: TableCellProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.playerNameContainer,
        index !== 0
          ? { borderLeftWidth: 1, borderColor: theme.colors.primary }
          : {},
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
