import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import ConfirmationModal from '../components/confirmation-modal';
import GameTable from '../components/game-table';
import TimeTracker from '../components/time-tracker';
import { usePreventBackPress } from '../hooks/usePreventBackPress';
import { useGameStore } from '../store/game';

export default function GameTableScreen() {
  const router = useRouter();

  const resetGame = useGameStore((state) => state.reset);

  usePreventBackPress();

  const handleReset = useCallback(() => {
    router.navigate('/players-selection');
    resetGame();
  }, [resetGame, router]);

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <ConfirmationModal
          title='Game reset'
          content='Are you sure you want to reset the game?'
          render={(showModal) => (
            <IconButton
              icon='arrow-left'
              onPress={showModal}
            />
          )}
          confirmationCallback={handleReset}
        />
        <TimeTracker />
      </View>
      <Divider
        bold
        style={style.divider}
      />
      <GameTable />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingEnd: 10,
  },
  divider: {
    marginBottom: 10,
  },
});
