import { useCallback } from "react";

import { BOLT_COUNT_LIMIT, BOLT_POINTS } from "@belot/constants";
import { type BaseScore, GameMode, type RoundScore } from "@belot/types";
import { roundToDecimal } from "@belot/utils/src";

import { TableCell } from "@/components/ui/table";

interface PointCellsProps {
  roundScore: RoundScore;
  gameMode: GameMode;
}

export default function PointCells({ roundScore, gameMode }: PointCellsProps) {
  const scoreArray =
    gameMode === GameMode.classic ? roundScore.playersScores : roundScore.teamsScores;

  const getScore = useCallback((score: BaseScore) => {
    if (score.score === BOLT_POINTS) return `BT-${score.boltCount}`;
    return score.totalScore;
  }, []);

  const getCurrentScore = useCallback((score: BaseScore) => {
    if (score.score === BOLT_POINTS) return score.boltCount === BOLT_COUNT_LIMIT ? "-10" : "";
    if (score.score > 0) return `+${score.score}`;
    return score.score;
  }, []);

  const getCurrentScoreColor = useCallback(
    (score: BaseScore) => {
      const currentScore = getCurrentScore(score);

      if (Number(currentScore) === -10 || currentScore.toString().includes("BT-")) {
        return "text-destructive";
      }

      return currentScore.toString().startsWith("+") ? "text-success" : "";
    },
    [getCurrentScore],
  );

  return (
    <>
      {scoreArray.map((score, index) => (
        <TableCell
          key={index}
          className={`${index !== 0 ? "border-primary border-l" : ""} relative flex flex-1 p-0`}
        >
          <div className="flex size-full items-center justify-center">
            <span className="text-xl">{getScore(score)}</span>
          </div>
          {score.score ? (
            <span className={`absolute top-0 right-0.5 text-xs ${getCurrentScoreColor(score)}`}>
              {getCurrentScore(score)}
            </span>
          ) : null}
        </TableCell>
      ))}
      <TableCell className="border-primary flex flex-1 border-l p-0">
        <div className="flex size-full items-center justify-center p-0">
          <span className="text-xl font-bold">
            {String(roundScore.totalRoundScore).length === 3
              ? roundToDecimal(roundScore.totalRoundScore)
              : roundScore.totalRoundScore}
          </span>
        </div>
      </TableCell>
    </>
  );
}
