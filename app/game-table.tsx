import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import ConfirmationDialog from '../components/confirmation-dialog';
import CurrentDealer from '../components/current-dealer';
import GameTable from '../components/game-table';
import TimeTracker from '../components/time-tracker';
import { usePreventBackPress } from '../hooks/usePreventBackPress';
import { useGameStore } from '../store/game';
import { usePlayersStore } from '../store/players';

export default function GameTableScreen() {
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();

  const resetPlayers = usePlayersStore((state) => state.reset);
  const resetGame = useGameStore((state) => state.reset);

  usePreventBackPress(() => setShowDialog(true));

  const handleReset = useCallback(() => {
    router.back();
    resetPlayers();
    resetGame();
  }, [resetGame, resetPlayers, router]);

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <ConfirmationDialog
          title='Game reset'
          content='Are you sure you want to reset the game?'
          renderShowDialog={(showModal) => (
            <IconButton
              icon='arrow-left'
              onPress={showModal}
            />
          )}
          confirmationCallback={handleReset}
          visible={showDialog}
          setVisible={setShowDialog}
        />
        <CurrentDealer />
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
