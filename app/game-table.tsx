import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import GameTable from '../components/game-table';

export default function GameTableScreen() {
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => true;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, []);

  const handleReset = useCallback(() => {
    router.navigate('/players-selection');
  }, [router]);

  return (
    <View style={styles.container}>
      <GameTable />
      <Button
        mode='contained'
        onPress={handleReset}>
        Reset
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',
  },
});
