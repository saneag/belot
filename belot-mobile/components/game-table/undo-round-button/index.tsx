import { IconButton, Tooltip } from 'react-native-paper';
import { useLocalizations } from '../../../localizations/useLocalization';
import { useGameStore } from '@belot/shared';
import { useMemo } from 'react';

export default function UndoRoundButton() {
  const messages = useLocalizations([
    {
      key: 'undo.round.title',
    },
  ]);

  const roundsScores = useGameStore((state) => state.roundsScores);
  const undoRoundScore = useGameStore((state) => state.undoRoundScore);

  const roundsScoresCount = useMemo(
    () => roundsScores.length,
    [roundsScores.length]
  );

  return (
    <Tooltip title={messages.undoRoundTitle}>
      <IconButton
        mode="outlined"
        icon="undo"
        onPress={undoRoundScore}
        disabled={roundsScoresCount === 1}
      />
    </Tooltip>
  );
}
