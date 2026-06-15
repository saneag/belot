import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { useLocalization } from "@belot/localizations";
import { RoundScore } from "@belot/types";
import {
  calculateTotalRoundScore,
  formatRoundPointPresetForDisplay,
  formatTotalRoundScoreForDisplay,
  getRoundPointsPresets,
} from "@belot/utils/src";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export interface RoundScoreSelectProps {
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  pointsType: string;
}

export default function RoundScoreSelect({
  roundScore,
  setRoundScore,
  pointsType,
}: RoundScoreSelectProps) {
  const [isPositive, setIsPositive] = useState(true);

  const roundScoreMsg = useLocalization("next.round.score", [
    formatTotalRoundScoreForDisplay(roundScore.totalRoundScore, pointsType),
  ]);

  const operationSign = isPositive ? "+" : "-";
  const roundPointsPresets = getRoundPointsPresets(pointsType);

  const handleRoundPointsChange = useCallback(
    (roundPoint: number) => {
      setRoundScore((prev) =>
        calculateTotalRoundScore(operationSign, roundPoint, prev, pointsType),
      );
    },
    [operationSign, pointsType, setRoundScore],
  );

  return (
    <VStack space="sm" className="mb-3">
      <Text size="xl" className="text-center">
        {roundScoreMsg}
      </Text>
      <HStack className="flex-wrap items-center justify-center gap-2.5">
        {roundPointsPresets.map((roundPoint) => (
          <Button
            variant="solid"
            action="secondary"
            key={roundPoint}
            onPress={() => handleRoundPointsChange(roundPoint)}
          >
            <ButtonText>
              {operationSign} {formatRoundPointPresetForDisplay(roundPoint, pointsType)}
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
