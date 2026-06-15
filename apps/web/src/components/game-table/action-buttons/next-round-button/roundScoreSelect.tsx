import { type Dispatch, type SetStateAction, useCallback, useState } from "react";

import { useGameStore } from "@belot/store";
import { useLocalization } from "@belot/localizations";
import { type RoundScore } from "@belot/types";
import {
  calculateTotalRoundScore,
  formatTotalRoundScoreForDisplay,
  getRoundPointsPresets,
} from "@belot/utils/src";

import { Button } from "@/components/ui/button";

export interface RoundScoreSelectProps {
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
}

export default function RoundScoreSelect({ roundScore, setRoundScore }: RoundScoreSelectProps) {
  const pointsType = useGameStore((state) => state.pointsType);
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
      <span className="text-center text-xl">{roundScoreMsg}</span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {roundPointsPresets.map((roundPoint) => (
          <Button
            key={roundPoint}
            variant="secondary"
            onClick={() => handleRoundPointsChange(roundPoint)}
          >
            {operationSign} {roundPoint}
          </Button>
        ))}
        <Button variant="outline" onClick={() => setIsPositive(!isPositive)}>
          {operationSign}
        </Button>
      </div>
    </div>
  );
}
