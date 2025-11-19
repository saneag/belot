import { ROUND_POINTS_INDEX } from '../../../constants/gameConstants';
import { GameMode, RoundScore } from '../../../types/game';
import TableCell from '../tableCell';

interface PointCellsProps {
  score: RoundScore;
  gameMode: GameMode;
}

export default function PointCells({ score, gameMode }: PointCellsProps) {
  const scoreArray =
    gameMode === 'classic' ? score.playersScores : score.teamsScores;

  return (
    <>
      {scoreArray.map((playerScore, index) => (
        <TableCell key={playerScore.id} index={index}>
          {Math.floor(playerScore.score / 10)}
        </TableCell>
      ))}
      <TableCell index={ROUND_POINTS_INDEX}>
        {Math.floor(score.totalRoundScore / 10)}
      </TableCell>
    </>
  );
}
