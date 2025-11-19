import { ROUND_POINTS_INDEX } from '../../../constants/gameConstants';
import { roundToDecimal } from '../../../helpers/gameScoreHelpers';
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
          {playerScore.score}
        </TableCell>
      ))}
      <TableCell index={ROUND_POINTS_INDEX}>
        {String(score.totalRoundScore).length === 3
          ? roundToDecimal(score.totalRoundScore)
          : score.totalRoundScore}
      </TableCell>
    </>
  );
}
