export const roundByLastDigit = (score: number) =>
  score % 10 <= 5 ? Math.floor(score / 10) : Math.ceil(score / 10);

export const roundToDecimal = (totalRoundScore: number) =>
  Math.floor(totalRoundScore / 10);
