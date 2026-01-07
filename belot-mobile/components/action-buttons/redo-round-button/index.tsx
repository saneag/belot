import { IconButton, Tooltip } from 'react-native-paper';
import { useLocalizations } from '../../../localizations/useLocalization';
import { useGameStore } from '@belot/shared';
import { useMemo } from 'react';

export default function RedoRoundButton() {
  const messages = useLocalizations([
    {
      key: 'redo.round.title',
    },
  ]);

  const undoneRoundsScores = useGameStore((state) => state.undoneRoundsScores);
  const redoRoundScore = useGameStore((state) => state.redoRoundScore);

  const undoneRoundsScoresCount = useMemo(
    () => undoneRoundsScores.length,
    [undoneRoundsScores.length]
  );

  return (
    <Tooltip title={messages.redoRoundTitle}>
      <IconButton
        icon="redo"
        mode="outlined"
        onPress={redoRoundScore}
        disabled={undoneRoundsScoresCount === 0}
      />
    </Tooltip>
  );
}
