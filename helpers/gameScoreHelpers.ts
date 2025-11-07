import {
  DEFAULT_ROUND_POINTS,
  ROUND_POINTS_INDEX,
} from '../constants/gameConstants';

export const prepareEmptyScoreRow = (
  playersCount: number,
  rowIndex: number
): Record<string, Record<string, string>> => {
  const players = Array.from({ length: playersCount !== 4 ? playersCount : 2 });
  const rawScore = players.reduce((acc: Record<string, string>, _, index) => {
    acc[index.toString()] = '0';
    return acc;
  }, {});

  rawScore[ROUND_POINTS_INDEX] = String(DEFAULT_ROUND_POINTS);

  return {
    [rowIndex.toString()]: rawScore,
  };
};
