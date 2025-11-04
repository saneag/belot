import { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useGameStore } from '../../../store/game';
import TableScoreRows from './tableScoreRows';

export default function TableBody() {
  const score = useGameStore((state) => state.score);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [score]);

  return (
    <ScrollView ref={scrollViewRef}>
      <TableScoreRows />
    </ScrollView>
  );
}
