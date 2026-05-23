import { GameMode, RoundScore } from "@belot/types";
import { getCurrentScore, getCurrentScoreColor, getScore, roundToDecimal } from "@belot/utils";

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
              <Text className={`absolute right-0.5 top-0 ${getCurrentScoreColor(score, true)}`}>
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
