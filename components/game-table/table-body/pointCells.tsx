import { useMemo } from 'react';
import { useGameStore } from '../../../store/game';
import { PlayersScore } from '../../../types/game';
import ConfirmationDialog from '../../confirmation-dialog';
import ScoreTableCell from './scoreTableCell';

interface PointCellsProps {
  rowIndex: string;
  points: PlayersScore;
}

export default function PointCells({ rowIndex, points }: PointCellsProps) {
  const currentRound = useGameStore((state) => state.currentRound);

  const pointsArray = useMemo(() => Object.entries(points), [points]);
  const columnsCount = useMemo(
    () => pointsArray.length - 1,
    [pointsArray.length]
  );

  return pointsArray.map(([player, point], index) =>
    Number(rowIndex) !== currentRound ? (
      <ScoreTableCell
        key={player}
        index={index}
        player={player}
        point={point}
        columnsCount={columnsCount}
      />
    ) : (
      <ConfirmationDialog
        key={player}
        asChild
        title=''
        content=''
        renderShowDialog={(showDialog) => (
          <ScoreTableCell
            key={player}
            index={index}
            player={player}
            point={point}
            onPress={showDialog}
            columnsCount={columnsCount}
          />
        )}
      />
    )
  );
}
