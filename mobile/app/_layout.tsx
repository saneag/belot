import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import i18n from 'i18next';
import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { createTheme } from '../helpers/themeHelpers';
import App from './index';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme: materialTheme } = useMaterial3Theme();

  const theme = useMemo(
    () => createTheme(colorScheme, materialTheme),
    [colorScheme, materialTheme]
  );

  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </PaperProvider>
  );
}
