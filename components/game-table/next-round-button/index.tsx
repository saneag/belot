import { useCallback, useState } from 'react';
import { Button } from 'react-native-paper';
import { validateEnteredScore } from '../../../helpers/gameScoreValidationHelpers';
import { useGameStore } from '../../../store/game';
import { usePlayersStore } from '../../../store/players';
import ConfirmationDialog from '../../confirmation-dialog';
import DialogContent from './dialogContent';
import DialogTitle from './dialogTitle';

export default function NextRoundButton() {
  const [isEmptyGame, setIsEmptyGame] = useState(false);
  const [isScoreValid, setIsScoreValid] = useState(true);

  const playersCount = usePlayersStore((state) => state.playersCount);

  const { score, currentRound, setNextScore } = useGameStore((state) => state);

  const handleNextRound = useCallback(
    (showDialog: VoidFunction) => {
      const validation = validateEnteredScore({
        score,
        currentRound,
        playersCount,
        setIsEmptyGame,
      });

      if (validation.isEmptyGame) {
        showDialog();
        return;
      }

      if (!validation.isValid) {
        setIsScoreValid(false);
        showDialog();
        return;
      }

      setIsScoreValid(true);
      setNextScore(playersCount);
    },
    [currentRound, playersCount, score, setNextScore]
  );

  const handleAddEmptyRow = useCallback(() => {
    if (isEmptyGame) {
      setNextScore(playersCount);
    }
  }, [isEmptyGame, playersCount, setNextScore]);

  return (
    <ConfirmationDialog
      title={<DialogTitle isEmptyGame={isEmptyGame} />}
      content={<DialogContent isEmptyGame={isEmptyGame} />}
      renderShowDialog={(showDialog) => (
        <Button
          mode='contained'
          onPress={() => handleNextRound(showDialog)}>
          Next round
        </Button>
      )}
      isConfirmButtonDisabled={!isScoreValid}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
