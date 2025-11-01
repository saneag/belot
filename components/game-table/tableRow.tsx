import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface TableRowProps {
  showTopBorder?: boolean;
  children: ReactNode;
}

export default function TableRow({
  children,
  showTopBorder = false,
}: TableRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        style.container,
        showTopBorder && {
          borderTopWidth: 1,
          borderColor: theme.colors.primary,
        },
      ]}>
      {children}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
