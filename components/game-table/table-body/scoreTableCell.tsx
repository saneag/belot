import { useAppTheme } from '../../../helpers/themeHelpers';
import { usePlayersStore } from '../../../store/players';
import TableCell from '../tableCell';

interface ScoreTableCellProps {
  index: number;
  point: string;
  onPress?: VoidFunction;
  columnsCount: number;
}

export default function ScoreTableCell({
  index,
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
      {point.slice(0, 2)}
    </TableCell>
  );
}
