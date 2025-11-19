import { useMemo } from 'react';
import { getPlayersNames } from '../../helpers/playerNamesHelpers';
import { useAppTheme } from '../../helpers/themeHelpers';
import { useGameStore } from '../../store/game';
import TableCell from './tableCell';
import TableRow from './tableRow';

export default function TableHeader() {
  const { colors } = useAppTheme();

  const players = useGameStore((state) => state.players);
  const mode = useGameStore((state) => state.mode);
  const playersNames = useMemo(() => getPlayersNames(players), [players]);
  const dealer = useGameStore((state) => state.dealer);

  const filteredPlayerNames = useMemo(
    () => (mode === 'classic' ? playersNames : ['N', 'V']),
    [mode, playersNames]
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
          }}
        >
          {playerName}
        </TableCell>
      ))}
    </TableRow>
  );
}
