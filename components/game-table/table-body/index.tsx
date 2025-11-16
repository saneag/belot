import { useEffect, useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';
import { getPlayersCount } from '../../../helpers/playerNamesHelpers';
import { useGameStore } from '../../../store/game';
import { usePlayersStore } from '../../../store/players';
import TableRow from '../tableRow';
import PointCells from './pointCells';

export default function TableBody() {
  const players = usePlayersStore((state) => state.players);
  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const scores = useGameStore((state) => state.scores);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [scores]);

  return (
    <ScrollView ref={scrollViewRef}>
      {scores.map((score) => (
        <TableRow key={score.id} showTopBorder>
          <PointCells score={score} playersCount={playersCount} />
        </TableRow>
      ))}
    </ScrollView>
  );
}
