import Navigation from '@/components/navigation';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MD3LightTheme, withTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface AppProps {
  theme: typeof MD3LightTheme;
}

function App({ theme }: AppProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          style.safeAreaContainer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={style.keyboardAwareContainer}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <Navigation />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const style = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  keyboardAwareContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default withTheme(App);
