import { ThemeProvider } from '@react-navigation/native';
import { useExtendedColorScheme } from './hooks/useExtendedColorScheme';
import RootContainer from './rootContainer';

export default function RootLayout() {
  const theme = useExtendedColorScheme();

  return (
    <ThemeProvider value={theme}>
      <RootContainer />
    </ThemeProvider>
  );
}
