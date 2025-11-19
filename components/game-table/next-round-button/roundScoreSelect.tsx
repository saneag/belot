import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ROUND_POINTS } from '../../../constants/gameConstants';

export default function RoundScoreSelect() {
  const [isPositive, setIsPositive] = useState(true);

  const operationSign = isPositive ? '+' : '-';

  const handleRoundPointsChange = useCallback((roundPoint: string) => {}, []);

  return (
    <View style={{ gap: 10, justifyContent: 'center' }}>
      <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
        {/* TODO: add round score display */}
        Round score:
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {ROUND_POINTS.map((roundPoint) => (
          <Button
            key={roundPoint}
            mode="elevated"
            onPress={() => handleRoundPointsChange(roundPoint)}
          >
            {operationSign} {Math.floor(Number(roundPoint) / 10)}
          </Button>
        ))}
        <Button mode="elevated" onPress={() => setIsPositive(!isPositive)}>
          {operationSign}
        </Button>
      </View>
    </View>
  );
}
