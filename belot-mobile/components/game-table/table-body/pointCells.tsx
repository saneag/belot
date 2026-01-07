import { useCallback } from 'react';
import { Text } from 'react-native-paper';
import {
  BOLT_COUNT_LIMIT,
  BOLT_POINTS,
  ROUND_POINTS_INDEX,
  roundToDecimal,
  BaseScore,
  GameMode,
  RoundScore,
} from '@belot/shared';
import { useAppTheme } from '@/helpers/themeHelpers';
import TableCell from '../tableCell';

interface PointCellsProps {
  score: RoundScore;
  gameMode: GameMode;
}

export default function PointCells({ score, gameMode }: PointCellsProps) {
  const { colors } = useAppTheme();

  const scoreArray =
    gameMode === GameMode.classic ? score.playersScores : score.teamsScores;

  const getScore = useCallback((score: BaseScore) => {
    if (score.score === BOLT_POINTS) return `BT-${score.boltCount}`;
    return score.totalScore;
  }, []);

  const getCurrentScore = useCallback((score: BaseScore) => {
    if (score.score === BOLT_POINTS)
      return score.boltCount === BOLT_COUNT_LIMIT ? '-10' : '';
    if (score.score > 0) return `+${score.score}`;
    return score.score;
  }, []);

  return (
    <>
      {scoreArray.map((playerScore, index) => (
        <TableCell key={playerScore.id} index={index}>
          <>
            <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
              {getScore(playerScore)}
            </Text>
            {playerScore.score ? (
              <Text
                style={{
                  position: 'absolute',
                  right: 2,
                  color:
                    getCurrentScore(playerScore) === '-10' ||
                    getCurrentScore(playerScore) === -10 ||
                    getCurrentScore(playerScore).toString().includes('BT-')
                      ? colors.error
                      : colors.green,
                }}
                variant="labelSmall"
              >
                {getCurrentScore(playerScore)}
              </Text>
            ) : null}
          </>
        </TableCell>
      ))}
      <TableCell index={ROUND_POINTS_INDEX}>
        {String(score.totalRoundScore).length === 3
          ? roundToDecimal(score.totalRoundScore)
          : score.totalRoundScore}
      </TableCell>
    </>
  );
}
