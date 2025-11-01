import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../../../store/game';
import TableRows from './tableRows';

export default function TableBody() {
  const score = useGameStore((state) => state.score);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [score]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}>
      <TableRows />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
