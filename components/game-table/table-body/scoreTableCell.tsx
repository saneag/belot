import { ROUND_POINTS_INDEX } from '../../../constants/gameConstants';
import { useAppTheme } from '../../../helpers/themeHelpers';
import { usePlayersStore } from '../../../store/players';
import TableCell from '../tableCell';

interface ScoreTableCellProps {
  index: number;
  player: string;
  point: string;
  onPress?: VoidFunction;
  columnsCount: number;
}

export default function ScoreTableCell({
  index,
  player,
  point,
  onPress,
  columnsCount,
}: ScoreTableCellProps) {
  const { colors } = useAppTheme();

  const dealer = usePlayersStore((state) => state.dealer);

  return (
    <TableCell
      index={index}
      style={{
        ...(index === dealer % columnsCount
          ? { backgroundColor: colors.successLight }
          : {}),
      }}
      onPress={onPress}>
      {player !== ROUND_POINTS_INDEX ? point : point.slice(0, 2)}
    </TableCell>
  );
}
