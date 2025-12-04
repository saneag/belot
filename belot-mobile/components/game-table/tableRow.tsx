import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface TableRowProps {
  showTopBorder?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function TableRow({
  children,
  showTopBorder = false,
  style = {},
}: TableRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        baseStyle.container,
        style,
        showTopBorder && {
          borderTopWidth: 1,
          borderColor: theme.colors.primary,
        },
      ]}>
      {children}
    </View>
  );
}

const baseStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
