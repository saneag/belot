import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

interface TableCellProps {
  index: number;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  textVariant?: VariantProp<TextStyle>;
  onPress?: VoidFunction;
}

export default function TableCell({
  index,
  children,
  style = {},
  textVariant = 'headlineSmall',
  onPress,
}: TableCellProps) {
  const theme = useTheme();

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
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
    </Container>
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
