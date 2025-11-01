import { useMemo } from 'react';
import { usePlayersStore } from '../../store/players';
import TableCell from './tableCell';
import TableRow from './tableRow';

export default function TableHeader() {
  const playersNames = usePlayersStore((state) => state.playersNames);

  const filteredPlayerNames = useMemo(
    () => Object.values(playersNames).filter(Boolean),
    [playersNames]
  );

  return (
    <TableRow>
      {filteredPlayerNames.map((playerName, index) => (
        <TableCell
          key={index}
          index={index}>
          {playerName}
        </TableCell>
      ))}
    </TableRow>
  );
}
