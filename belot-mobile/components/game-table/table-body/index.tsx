import { useEffect, useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useGameStore } from '@belot/shared';
import TableRow from '../tableRow';
import PointCells from './pointCells';
import { useAppTheme } from '../../../helpers/themeHelpers';

export default function TableBody() {
  const { colors } = useAppTheme();

  const players = useGameStore((state) => state.players);
  const playersCount = useMemo(() => players.length, [players.length]);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);
  const scrollViewRef = useRef<ScrollView>(null);
  const roundsScoresCount = useMemo(
    () => roundsScores.length,
    [roundsScores.length]
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [roundsScores]);

  return (
    <ScrollView ref={scrollViewRef}>
      {roundsScores.map(
        (score, index) =>
          index !== roundsScoresCount - 1 && (
            <TableRow
              key={score.id}
              showTopBorder={index !== 0}
              style={
                index !== 0 &&
                index % playersCount === 0 && {
                  borderTopWidth: 3,
                  borderColor: colors.primary,
                }
              }
            >
              <PointCells score={score} gameMode={gameMode} />
            </TableRow>
          )
      )}
    </ScrollView>
  );
}
