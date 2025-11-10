import { useMemo } from 'react';
import { useAppTheme } from '../../helpers/themeHelpers';
import { usePlayersStore } from '../../store/players';
import TableCell from './tableCell';
import TableRow from './tableRow';

export default function TableHeader() {
  const { colors } = useAppTheme();

  const playersCount = usePlayersStore((state) => state.playersCount);
  const playersNames = usePlayersStore((state) => state.playersNames);
  const dealer = usePlayersStore((state) => state.dealer);

  const filteredPlayerNames = useMemo(
    () =>
      playersCount !== 4
        ? Object.values(playersNames).filter(Boolean)
        : ['N', 'V'],
    [playersCount, playersNames]
  );

  const playerNamesWithScoreColumn = useMemo(
    () => [...filteredPlayerNames, 'Score'],
    [filteredPlayerNames]
  );

  const columnsCount = useMemo(
    () => filteredPlayerNames.length,
    [filteredPlayerNames.length]
  );

  return (
    <TableRow style={{ backgroundColor: colors.backdrop }}>
      {playerNamesWithScoreColumn.map((playerName, index) => (
        <TableCell
          key={index}
          index={index}
          style={{
            fontWeight: 'bold',
            ...(index === dealer % columnsCount
              ? { backgroundColor: colors.successLight }
              : {}),
          }}>
          {playerName}
        </TableCell>
      ))}
    </TableRow>
  );
}
