import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { usePreventBackPress } from '../../hooks/usePreventBackPress';
import { useGameStore } from '../../store/game';
import { usePlayersStore } from '../../store/players';
import ConfirmationDialog from '../confirmation-dialog';
import CurrentDealer from '../current-dealer';
import TimeTracker from '../time-tracker';

export default function Header() {
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
    <View style={style.headerContainer}>
      <ConfirmationDialog
        title="Game reset"
        content="Are you sure you want to reset the game?"
        renderShowDialog={(showModal) => (
          <IconButton icon="arrow-left" onPress={showModal} />
        )}
        confirmationCallback={handleReset}
        visible={showDialog}
        setVisible={setShowDialog}
      />
      <CurrentDealer />
      <TimeTracker />
    </View>
  );
}

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingEnd: 10,
  },
});
