import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useHandleNextRound } from '../../../hooks/useHandleNextRound';
import ConfirmationDialog from '../../confirmation-dialog';
import SkipRoundButton from '../skip-round-button';
import ScoreDialogContent from './scoreDialogContent';

export default function NextRoundButton() {
  const {
    handleNextRound,
    handleCancel,
    inputValue,
    setInputValue,
    roundPlayer,
    setRoundPlayer,
    roundScore,
    setRoundScore,
  } = useHandleNextRound();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <SkipRoundButton />

      <ConfirmationDialog
        title='Enter score'
        content={
          <ScoreDialogContent
            inputValue={inputValue}
            setInputValue={setInputValue}
            roundPlayer={roundPlayer}
            setRoundPlayer={setRoundPlayer}
            roundScore={roundScore}
            setRoundScore={setRoundScore}
          />
        }
        renderShowDialog={(showDialog) => (
          <Button
            mode='contained'
            onPress={showDialog}>
            Next round
          </Button>
        )}
        confirmationCallback={handleNextRound}
        cancelCallback={handleCancel}
      />
    </View>
  );
}
