import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface TableRowProps {
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function TableRow({
  children,
  showTopBorder = false,
  showBottomBorder = false,
  style = {},
}: TableRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        baseStyle.container,
        showTopBorder && {
          borderTopWidth: 1,
          borderColor: theme.colors.primary,
        },
        showBottomBorder && {
          borderBottomWidth: 1,
          borderColor: theme.colors.primary,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const baseStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
