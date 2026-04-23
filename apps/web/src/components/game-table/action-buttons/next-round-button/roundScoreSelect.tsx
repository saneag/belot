import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { ROUND_POINTS } from "@belot/constants";
import { type RoundScore } from "@belot/types";
import { calculateTotalRoundScore, roundToDecimal } from "@belot/utils/src";

import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-1">
      <span className="text-center text-xl">{roundScoreMsg}</span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {ROUND_POINTS.map((roundPoint) => (
          <Button key={roundPoint} onClick={() => handleRoundPointsChange(roundPoint)}>
            {operationSign} {roundToDecimal(roundPoint)}
          </Button>
        ))}
        <Button onClick={() => setIsPositive(!isPositive)}>{operationSign}</Button>
      </div>
    </div>
  );
}
