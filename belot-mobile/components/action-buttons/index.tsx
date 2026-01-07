import { View, StyleSheet } from 'react-native';
import UndoRoundButton from './undo-round-button';
import RedoRoundButton from './redo-round-button';
import EditRoundButton from './edit-round-button';
import SkipRoundButton from './skip-round-button';
import NextRoundButton from './next-round-button';
import { Dispatch, SetStateAction } from 'react';
import { Player, Team, useGameStore } from '@belot/shared';
import { Snackbar } from 'react-native-paper';
import { useLocalizations } from '../../localizations/useLocalization';

interface ActionButtonsProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ActionButtons({ setWinner }: ActionButtonsProps) {
  const messages = useLocalizations([
    { key: 'edit.round.info' },
    { key: 'confirmation.dialog.cancel.button' },
  ]);

  const isScoreEdit = useGameStore((state) => state.isScoreEdit);
  const setIsScoreEdit = useGameStore((state) => state.setIsScoreEdit);

  return (
    <View style={style.container}>
      <View style={style.actionButtons}>
        <UndoRoundButton />
        <RedoRoundButton />
        <EditRoundButton />
        <SkipRoundButton />
        <NextRoundButton setWinner={setWinner} />
      </View>
      <Snackbar
        visible={isScoreEdit}
        onDismiss={() => setIsScoreEdit(false)}
        style={{
          zIndex: 1,
        }}
        elevation={1}
        action={{
          label: messages.confirmationDialogCancelButton,
          onPress: () => setIsScoreEdit(false),
        }}
        duration={Infinity}
      >
        {messages.editRoundInfo}
      </Snackbar>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 5,
    flexWrap: 'wrap',
  },
});
