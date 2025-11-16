import { useMemo } from 'react';
import {
  getDealer,
  getPlayersCount,
  getPlayersNames,
} from '../../helpers/playerNamesHelpers';
import { useAppTheme } from '../../helpers/themeHelpers';
import { usePlayersStore } from '../../store/players';
import TableCell from './tableCell';
import TableRow from './tableRow';

export default function TableHeader() {
  const { colors } = useAppTheme();

  const players = usePlayersStore((state) => state.players);
  const playersCount = useMemo(() => getPlayersCount(players), [players]);
  const playersNames = useMemo(() => getPlayersNames(players), [players]);
  const dealer = useMemo(() => getDealer(players), [players]);

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
            ...(index === (dealer?.id || 0) % columnsCount
              ? { backgroundColor: colors.successLight }
              : {}),
          }}>
          {playerName}
        </TableCell>
      ))}
    </TableRow>
  );
}
