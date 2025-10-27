import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useExtendedColorScheme } from '../../hooks/useExtendedColorScheme';

type ThemedViewProps = React.ComponentProps<typeof View>;

export default function ThemedView({ ...props }: ThemedViewProps) {
  const theme = useExtendedColorScheme();

  const baseStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.background,
          color: theme.text,
        },
      }),
    [theme]
  );

  return (
    <View
      style={[baseStyles.container, props.style]}
      {...props}
    />
  );
}
