export const prepareEmptyScoreRow = (
  playersCount: number,
  rowIndex: number
): Record<string, Record<string, string>> => {
  const players = Array.from({ length: playersCount });
  const rawScore = players.reduce((acc: Record<string, string>, _, index) => {
    acc[index.toString()] = '0';
    return acc;
  }, {});

  return {
    [rowIndex.toString()]: rawScore,
  };
};
