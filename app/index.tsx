import Navigation from '@/components/navigation';
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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
    flex: 1,
  },
  keyboardAwareContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default withTheme(App);
