import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useHandleNextRound } from '../../../hooks/useHandleNextRound';
import ConfirmationDialog from '../../confirmation-dialog';
import SkipRoundButton from '../skip-round-button';
import ScoreDialogContent from './scoreDialogContent';

export default function NextRoundButton() {
  const { handleNextRound, handleCancel, ...rest } = useHandleNextRound();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <SkipRoundButton />

      <ConfirmationDialog
        title="Enter score"
        content={<ScoreDialogContent {...rest} />}
        renderShowDialog={(showDialog) => (
          <Button mode="contained" onPress={showDialog}>
            Next round
          </Button>
        )}
        isConfirmationButtonVisible={!!rest.roundPlayer}
        confirmationCallback={handleNextRound}
        cancelCallback={handleCancel}
      />
    </View>
  );
}
