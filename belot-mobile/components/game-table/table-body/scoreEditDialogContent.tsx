import { Player, RoundScore, Team } from '@belot/shared';
import ScoreDialogContent from '../../action-buttons/next-round-button/scoreDialogContent';
import { Dispatch, SetStateAction } from 'react';
import { useHandleCalculateRound } from '../../../hooks/useHandleCalculateRound';

interface ScoreEditDialogContentProps {
  score: RoundScore | null;
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ScoreEditDialogContent({
  score,
  setWinner,
}: ScoreEditDialogContentProps) {
  const { handleRoundCalculation, handleCancel, handleDialogOpen, ...rest } =
    useHandleCalculateRound({ setWinner });

  if (!score) {
    return null;
  }

  return <ScoreDialogContent {...rest} />;
}
