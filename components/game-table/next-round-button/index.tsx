import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useHandleNextRound } from '../../../hooks/useHandleNextRound';
import ConfirmationDialog from '../../confirmation-dialog';
import DialogContent from './dialogContent';
import DialogTitle from './dialogTitle';

export default function NextRoundButton() {
  const { handleNextRound, isScoreValid } = useHandleNextRound();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <ConfirmationDialog
        title={<DialogTitle />}
        content={<DialogContent />}
        renderShowDialog={(showDialog) => (
          <Button
            mode='contained'
            onPress={showDialog}>
            Next round
          </Button>
        )}
        isConfirmationButtonVisible={isScoreValid}
        confirmationCallback={handleNextRound}
      />
    </View>
  );
}
