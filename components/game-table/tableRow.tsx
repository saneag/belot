import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface TableRowProps {
  showTopBorder?: boolean;
  children: ReactNode;
}

export default function TableRow({
  children,
  showTopBorder = false,
}: TableRowProps) {
  return (
    <View
      style={[
        style.container,
        showTopBorder && {
          borderTopWidth: 1,
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
