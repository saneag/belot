import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MD3LightTheme, withTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './components/navigation';

interface AppProps {
  theme: typeof MD3LightTheme;
}

function App({ theme }: AppProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.safeAreaContainer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.keyboardAwareContainer}
          enableOnAndroid
          keyboardShouldPersistTaps='handled'>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <Navigation />
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    paddingStart: 10,
    paddingEnd: 10,
    flex: 1,
  },
  keyboardAwareContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default withTheme(App);
