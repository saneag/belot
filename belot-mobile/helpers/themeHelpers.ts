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
      successLight: colorScheme === 'dark' ? '#4ADE80' : '#86EFAC',
      green: colorScheme === 'dark' ? '#4ADE80' : '#1B8A36',
      blue: colorScheme === 'dark' ? '#3B82F6' : '#2563EB',
    },
  };
};

export type AppTheme = ReturnType<typeof createTheme>;

export const useAppTheme = () => useTheme<AppTheme>();
