import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from '../../constants/theme';

export const useExtendedColorScheme = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;
  return theme;
};
