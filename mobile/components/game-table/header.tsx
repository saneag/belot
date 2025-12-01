import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { usePreventBackPress } from '@/hooks/usePreventBackPress';
import { useLocalizations } from '@/localizations/useLocalization';
import { useGameStore } from '@/store/game';
import ConfirmationDialog from '../confirmation-dialog';
import CurrentDealer from '../current-dealer';
import TimeTracker from '../time-tracker';

export default function Header() {
  const router = useRouter();
  const messages = useLocalizations([
    {
      key: 'game.reset.title',
    },
    {
      key: 'game.reset.content',
    },
  ]);

  const [showDialog, setShowDialog] = useState(false);

  const resetGame = useGameStore((state) => state.reset);

  usePreventBackPress(() => setShowDialog(true));

  const handleReset = useCallback(() => {
    router.back();
    resetGame();
  }, [resetGame, router]);

  return (
    <View style={style.headerContainer}>
      <ConfirmationDialog
        title={messages.gameResetTitle}
        content={messages.gameResetContent}
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
