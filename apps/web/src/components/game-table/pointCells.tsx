import { GameMode, type RoundScore } from "@belot/types";
import { getCurrentScore, getCurrentScoreColor, getScore, roundToDecimal } from "@belot/utils/src";

import { TableCell } from "@/components/ui/table";

interface PointCellsProps {
  roundScore: RoundScore;
  gameMode: GameMode;
}

const getWebCurrentScoreColor = (score: Parameters<typeof getCurrentScoreColor>[0]) => {
  const color = getCurrentScoreColor(score);

  if (color === "text-success") return "text-success";
  if (color === "text-destructive") return "text-destructive";

  return "";
};

export default function PointCells({ roundScore, gameMode }: PointCellsProps) {
  const scoreArray =
    gameMode === GameMode.classic ? roundScore.playersScores : roundScore.teamsScores;

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
            <span className={`absolute top-0 right-0.5 text-xs ${getWebCurrentScoreColor(score)}`}>
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
