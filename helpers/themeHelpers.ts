import { MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper';

export const createTheme = (
  colorScheme: 'light' | 'dark',
  materialTheme: any
) => {
  const baseTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const materialColors =
    colorScheme === 'dark' ? materialTheme.dark : materialTheme.light;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...materialColors,
      success: colorScheme === 'dark' ? '#22C55E' : '#16A34A',
    },
  };
};

export type AppTheme = ReturnType<typeof createTheme>;

export const useAppTheme = () => useTheme<AppTheme>();
