import { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

interface TableCellProps {
  index: number;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  textVariant?: VariantProp<TextStyle>;
}

export default function TableCell({
  index,
  children,
  style = {},
  textVariant = 'headlineSmall',
}: TableCellProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        baseStyle.playerNameContainer,
        index !== 0
          ? { borderLeftWidth: 1, borderColor: theme.colors.primary }
          : {},
      ]}>
      {typeof children === 'string' ? (
        <Text
          variant={textVariant}
          style={[baseStyle.playerNameText, style]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const baseStyle = StyleSheet.create({
  playerNameContainer: {
    flex: 1,
  },
  playerNameText: {
    textAlign: 'center',
  },
});
