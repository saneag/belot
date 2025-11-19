import { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useGameStore } from '../../../store/game';
import TableRow from '../tableRow';
import PointCells from './pointCells';

export default function TableBody() {
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [roundsScores]);

  return (
    <ScrollView ref={scrollViewRef}>
      {roundsScores.map((score) => (
        <TableRow key={score.id} showTopBorder>
          <PointCells score={score} gameMode={gameMode} />
        </TableRow>
      ))}
    </ScrollView>
  );
}
