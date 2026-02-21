import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { ROUND_POINTS } from "@belot/constants";
import { RoundScore } from "@belot/types";
import { calculateTotalRoundScore, roundToDecimal } from "@belot/utils";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useLocalization } from "@/localizations/useLocalization";

export interface RoundScoreSelectProps {
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
}

export default function RoundScoreSelect({ roundScore, setRoundScore }: RoundScoreSelectProps) {
  const [isPositive, setIsPositive] = useState(true);

  const roundScoreMsg = useLocalization("next.round.score", [
    roundToDecimal(roundScore.totalRoundScore),
  ]);

  const operationSign = isPositive ? "+" : "-";

  const handleRoundPointsChange = useCallback(
    (roundPoint: number) => {
      setRoundScore((prev) => calculateTotalRoundScore(operationSign, roundPoint, prev));
    },
    [operationSign, setRoundScore],
  );

  return (
    <VStack space="sm" className="mb-3">
      <Text size="xl" className="text-center">
        {roundScoreMsg}
      </Text>
      <HStack className="flex-wrap items-center justify-center gap-2.5">
        {ROUND_POINTS.map((roundPoint) => (
          <Button
            variant="solid"
            action="secondary"
            key={roundPoint}
            onPress={() => handleRoundPointsChange(roundPoint)}
          >
            <ButtonText>
              {operationSign} {roundToDecimal(roundPoint)}
            </ButtonText>
          </Button>
        ))}
        <Button variant="outline" action="secondary" onPress={() => setIsPositive(!isPositive)}>
          <ButtonText>{operationSign}</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
