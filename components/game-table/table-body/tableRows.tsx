import { useGameStore } from '../../../store/game';
import TableCell from '../tableCell';
import TableRow from '../tableRow';

export default function TableRows() {
  const score = useGameStore((state) => state.score);

  return (
    <>
      {Object.entries(score).map(([row, points]) => (
        <TableRow
          key={row}
          showTopBorder>
          {Object.entries(points).map(([player, point], index) => (
            <TableCell
              key={player}
              index={index}>
              {point}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
