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
  const isTeamVsTeam = usePlayersStore((state) => state.isTeamVsTeam);
  const dealer = usePlayersStore((state) => state.dealer);
  const setDealer = usePlayersStore((state) => state.setDealer);

  const score = useGameStore((state) => state.score);
  const setNextScore = useGameStore((state) => state.setNextScore);
  const currentRound = useGameStore((state) => state.currentRound);

  const handleNextRound = useCallback(
    (showDialog: VoidFunction) => {
      const validation = validateEnteredScore({
        roundScore: score[currentRound],
        playersCount,
        setIsEmptyGame,
        isTeamVsTeam,
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
      setDealer(dealer + 1 === playersCount ? 0 : dealer + 1);
    },
    [
      currentRound,
      dealer,
      isTeamVsTeam,
      playersCount,
      score,
      setDealer,
      setNextScore,
    ]
  );

  const handleAddEmptyRow = useCallback(() => {
    if (isEmptyGame) {
      setNextScore(playersCount);
    }

    setDealer(dealer + 1 === playersCount ? 0 : dealer + 1);
  }, [dealer, isEmptyGame, playersCount, setDealer, setNextScore]);

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
      isConfirmationButtonVisible={isScoreValid}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
