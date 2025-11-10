import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import {
  LIMIT_OF_ROUND_POINTS,
  ROUND_POINTS,
} from '../../../constants/gameConstants';

export interface RoundScoreSelectProps {
  roundScore: string;
  setRoundScore: Dispatch<SetStateAction<string>>;
}

export default function RoundScoreSelect({
  roundScore,
  setRoundScore,
}: RoundScoreSelectProps) {
  const [isPositive, setIsPositive] = useState(true);

  const operationSign = isPositive ? '+' : '-';

  const handleRoundPointsChange = useCallback(
    (roundPoint: string) => {
      const numberRoundScore = Number(roundScore);
      const numberRoundPoint = Number(roundPoint);

      if (isPositive) {
        const sumOfPoints = numberRoundScore + numberRoundPoint;
        const finalRoundPoints =
          sumOfPoints >= LIMIT_OF_ROUND_POINTS.positive
            ? LIMIT_OF_ROUND_POINTS.positive
            : sumOfPoints;

        setRoundScore(String(finalRoundPoints));
      } else {
        const differenceOfPoints = numberRoundScore - numberRoundPoint;
        const finalRoundPoints =
          differenceOfPoints <= LIMIT_OF_ROUND_POINTS.negative
            ? LIMIT_OF_ROUND_POINTS.negative
            : differenceOfPoints;
        setRoundScore(String(finalRoundPoints));
      }
    },
    [isPositive, roundScore, setRoundScore]
  );

  return (
    <View style={{ gap: 10, justifyContent: 'center' }}>
      <Text
        variant='bodyLarge'
        style={{ textAlign: 'center' }}>
        Round score: {Math.floor(Number(roundScore) / 10)}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        {ROUND_POINTS.map((roundPoint) => (
          <Button
            key={roundPoint}
            mode='elevated'
            onPress={() => handleRoundPointsChange(roundPoint)}>
            {operationSign} {Math.floor(Number(roundPoint) / 10)}
          </Button>
        ))}
        <Button
          mode='elevated'
          onPress={() => setIsPositive(!isPositive)}>
          {operationSign}
        </Button>
      </View>
    </View>
  );
}
