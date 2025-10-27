import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useExtendedColorScheme } from '../../hooks/useExtendedColorScheme';

type ThemedTextProps = React.ComponentProps<typeof Text>;

export default function ThemedText({ ...props }: ThemedTextProps) {
  const theme = useExtendedColorScheme();

  const baseStyles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: theme.text,
        },
      }),
    [theme]
  );

  return (
    <Text
      {...props}
      style={[baseStyles.text, props.style]}
    />
  );
}
