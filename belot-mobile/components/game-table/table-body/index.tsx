import { Fragment, useEffect, useMemo, useRef } from 'react';
import { Pressable, PressableProps, ScrollView } from 'react-native';
import { useGameStore } from '@belot/shared';
import TableRow from '../tableRow';
import PointCells from './pointCells';
import { useAppTheme } from '../../../helpers/themeHelpers';
import AnimatedTableBorder from '../animatedTableBorder';

export default function TableBody() {
  const { colors } = useAppTheme();

  const players = useGameStore((state) => state.players);
  const playersCount = useMemo(() => players.length, [players.length]);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);
  const isScoreEdit = useGameStore((state) => state.isScoreEdit);

  const scrollViewRef = useRef<ScrollView>(null);
  const roundsScoresCount = useMemo(
    () => roundsScores.length,
    [roundsScores.length]
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [roundsScores]);

  const Container = isScoreEdit ? Pressable : Fragment;
  const containerProps = isScoreEdit
    ? ({
        onPress: () => {
          // TODO: add edit dialog
        },
      } as PressableProps)
    : {};

  const getRowStyles = (index: number) =>
    index !== 0 &&
    index % playersCount === 0 && {
      borderTopWidth: 3,
      borderColor: colors.primary,
    };
  return (
    <ScrollView ref={scrollViewRef} style={{ position: 'relative' }}>
      {isScoreEdit && <AnimatedTableBorder />}
      {roundsScores.map(
        (score, index) =>
          index !== roundsScoresCount - 1 && (
            <Container key={score.id} {...containerProps}>
              <TableRow
                showTopBorder={index !== 0}
                style={{
                  ...getRowStyles(index),
                }}
              >
                <PointCells score={score} gameMode={gameMode} />
              </TableRow>
            </Container>
          )
      )}
    </ScrollView>
  );
}
