import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';

export const prepareEmptyScoreRow = (
  playersCount: number,
  rowIndex: number
): Record<string, Record<string, string>> => {
  const players = Array.from({ length: playersCount !== 4 ? playersCount : 2 });
  const rawScore = players.reduce((acc: Record<string, string>, _, index) => {
    acc[index.toString()] = '0';
    return acc;
  }, {});

  const roundPointsWithoutMicroPoints = String(DEFAULT_ROUND_POINTS).slice(
    0,
    2
  );

  rawScore['-1'] = String(roundPointsWithoutMicroPoints);

  return {
    [rowIndex.toString()]: rawScore,
  };
};
