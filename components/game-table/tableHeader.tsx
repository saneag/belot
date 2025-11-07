import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { usePlayersStore } from '../../store/players';
import TableCell from './tableCell';
import TableRow from './tableRow';

export default function TableHeader() {
  const theme = useTheme();

  const playersNames = usePlayersStore((state) => state.playersNames);

  const filteredPlayerNames = useMemo(
    () => Object.values(playersNames).filter(Boolean),
    [playersNames]
  );

  const playerNamesWithScoreColumn = useMemo(
    () => [...filteredPlayerNames, 'Score'],
    [filteredPlayerNames]
  );

  return (
    <TableRow style={{ backgroundColor: theme.colors.backdrop }}>
      {playerNamesWithScoreColumn.map((playerName, index) => (
        <TableCell
          key={index}
          index={index}
          style={{ fontWeight: 'bold' }}>
          {playerName}
        </TableCell>
      ))}
    </TableRow>
  );
}
