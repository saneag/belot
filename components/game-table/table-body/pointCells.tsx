import { useMemo } from 'react';
import { PlayersScore } from '../../../types/game';
import ScoreTableCell from './scoreTableCell';

interface PointCellsProps {
  points: PlayersScore;
}

export default function PointCells({ points }: PointCellsProps) {
  const pointsArray = useMemo(() => Object.entries(points), [points]);
  const columnsCount = useMemo(
    () => pointsArray.length - 1,
    [pointsArray.length]
  );

  return pointsArray.map(([playerIndex, playerPoint], index) => (
    <ScoreTableCell
      key={playerIndex}
      index={index}
      point={playerPoint}
      columnsCount={columnsCount}
    />
  ));
}
