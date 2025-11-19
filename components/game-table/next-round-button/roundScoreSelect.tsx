import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ROUND_POINTS } from '../../../constants/gameConstants';
import {
  calculateTotalRoundScore,
  roundToDecimal,
} from '../../../helpers/gameScoreHelpers';
import { RoundScore } from '../../../types/game';

export interface RoundScoreSelectProps {
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
}

export default function RoundScoreSelect({
  roundScore,
  setRoundScore,
}: RoundScoreSelectProps) {
  const [isPositive, setIsPositive] = useState(true);

  const operationSign = isPositive ? '+' : '-';

  const handleRoundPointsChange = useCallback(
    (roundPoint: number) => {
      setRoundScore((prev) =>
        calculateTotalRoundScore(operationSign, roundPoint, prev)
      );
    },
    [operationSign, setRoundScore]
  );

  return (
    <View style={{ gap: 10, justifyContent: 'center' }}>
      <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
        Round score: {roundToDecimal(roundScore.totalRoundScore)}
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
            {operationSign} {roundToDecimal(roundPoint)}
          </Button>
        ))}
        <Button mode="elevated" onPress={() => setIsPositive(!isPositive)}>
          {operationSign}
        </Button>
      </View>
    </View>
  );
}
