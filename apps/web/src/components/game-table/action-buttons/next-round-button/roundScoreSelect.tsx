import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { useLocalization } from "@belot/localizations";
import { type RoundScore } from "@belot/types";
import {
  calculateTotalRoundScore,
  formatRoundPointPresetForDisplay,
  formatTotalRoundScoreForDisplay,
  getRoundPointsPresets,
} from "@belot/utils/src";

import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-1">
      <span className="text-center text-xl" data-testid="round-score-display">
        {roundScoreMsg}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {roundPointsPresets.map((roundPoint) => (
          <Button
            key={roundPoint}
            variant="secondary"
            onClick={() => handleRoundPointsChange(roundPoint)}
            data-testid={`round-score-select-button-${operationSign}${roundPoint}`}
          >
            {operationSign} {formatRoundPointPresetForDisplay(roundPoint, pointsType)}
          </Button>
        ))}
        <Button variant="outline" onClick={() => setIsPositive(!isPositive)}>
          {operationSign}
        </Button>
      </div>
    </div>
  );
}
