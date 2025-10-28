import { MD3LightTheme, withTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PlayersSelection from './screens/players-selection';

interface AppProps {
  theme: typeof MD3LightTheme;
}

function App({ theme }: AppProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          paddingStart: 10,
          paddingEnd: 10,
          flex: 1,
          backgroundColor: theme.colors.background,
        }}>
        <PlayersSelection />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default withTheme(App);
