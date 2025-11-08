import { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useGameStore } from '../../../store/game';
import TableRow from '../tableRow';
import PointCells from './pointCells';

export default function TableBody() {
  const score = useGameStore((state) => state.score);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [score]);

  return (
    <ScrollView ref={scrollViewRef}>
      <>
        {Object.entries(score).map(([rowIndex, points]) => (
          <TableRow
            key={rowIndex}
            showTopBorder>
            <PointCells
              rowIndex={rowIndex}
              points={points}
            />
          </TableRow>
        ))}
      </>
    </ScrollView>
  );
}
