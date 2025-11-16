import { ROUND_POINTS_INDEX } from '../../../constants/gameConstants';
import { GameScore } from '../../../types/game';
import TableCell from '../tableCell';

interface PointCellsProps {
  score: GameScore;
  playersCount: number;
}

export default function PointCells({ score, playersCount }: PointCellsProps) {
  return (
    <>
      {score.playersScores.map((playerScore, index) =>
        playersCount === 4 ? (
          index % 2 === 0 && (
            <TableCell key={playerScore.id} index={index}>
              {Math.floor(playerScore.score / 10)}
            </TableCell>
          )
        ) : (
          <TableCell key={playerScore.id} index={index}>
            {Math.floor(playerScore.score / 10)}
          </TableCell>
        )
      )}
      <TableCell index={ROUND_POINTS_INDEX}>
        {Math.floor(score.totalRoundScore / 10)}
      </TableCell>
    </>
  );
}
