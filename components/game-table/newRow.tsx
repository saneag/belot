import { useCallback } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useGameStore } from '../../store/game';
import { usePlayersStore } from '../../store/players';

export default function NewRow() {
  const playersCount = usePlayersStore((state) => state.playersCount);

  const setNextScore = useGameStore((state) => state.setNextScore);

  const handleAddEmptyRow = useCallback(() => {
    setNextScore(playersCount);
  }, [playersCount, setNextScore]);

  return (
    <View>
      <Button
        mode='contained'
        onPress={handleAddEmptyRow}>
        Next round
      </Button>
    </View>
  );
}
