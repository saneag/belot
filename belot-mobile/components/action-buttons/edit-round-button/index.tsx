import { IconButton, Tooltip } from 'react-native-paper';
import { useLocalizations } from '../../../localizations/useLocalization';
import { useGameStore } from '@belot/shared';
import { useMemo } from 'react';

export default function EditRoundButton() {
  const messages = useLocalizations([
    {
      key: 'edit.round.title',
    },
  ]);

  const isScoreEdit = useGameStore((state) => state.isScoreEdit);
  const setIsScoreEdit = useGameStore((state) => state.setIsScoreEdit);
  const roundsScores = useGameStore((state) => state.roundsScores);

  const roundsScoresCount = useMemo(
    () => roundsScores.length,
    [roundsScores.length]
  );

  return (
    <Tooltip title={messages.editRoundTitle}>
      <IconButton
        icon="pencil"
        mode="outlined"
        onPress={() => setIsScoreEdit(true)}
        disabled={roundsScoresCount === 1 || isScoreEdit}
      />
    </Tooltip>
  );
}
