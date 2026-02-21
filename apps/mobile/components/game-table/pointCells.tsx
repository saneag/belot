import { useCallback } from "react";

import { BOLT_COUNT_LIMIT, BOLT_POINTS } from "@belot/constants";
import { BaseScore, GameMode, RoundScore } from "@belot/types";
import { roundToDecimal } from "@belot/utils";

import { Box } from "@/components/ui/box";
import { TableData } from "@/components/ui/table";
import { Text } from "@/components/ui/text";

interface PointCellsProps {
  roundScore: RoundScore;
  gameMode: GameMode;
}

const COMMON_CELL_CLASSNAME = "size-full py-1";

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
        return "text-red-500";
      }

      return currentScore.toString().startsWith("+") ? "text-green-500" : "";
    },
    [getCurrentScore],
  );

  return (
    <>
      {scoreArray.map((score, index) => (
        <TableData
          key={index}
          className={`p-0 ${index !== 0 ? "border-l border-primary-500" : ""}`}
        >
          <Box className={`relative ${COMMON_CELL_CLASSNAME}`}>
            <Text size="xl" className="text-center">
              {getScore(score)}
            </Text>
            {score.score ? (
              <Text className={`absolute right-0.5 top-0 ${getCurrentScoreColor(score)}`}>
                {getCurrentScore(score)}
              </Text>
            ) : null}
          </Box>
        </TableData>
      ))}
      <TableData className="border-l border-primary-500 p-0">
        <Box className={`${COMMON_CELL_CLASSNAME}`}>
          <Text size="xl" bold className="text-center">
            {String(roundScore.totalRoundScore).length === 3
              ? roundToDecimal(roundScore.totalRoundScore)
              : roundScore.totalRoundScore}
          </Text>
        </Box>
      </TableData>
    </>
  );
}
