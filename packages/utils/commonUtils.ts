export const roundByLastDigit = (score: number) =>
  score % 10 <= 5 ? Math.floor(score / 10) : Math.ceil(score / 10);

export const roundToDecimal = (totalRoundScore: number) =>
  Math.floor(totalRoundScore / 10);

export const removeNthElementFromEnd = (array: any[], index: number) => {
  if (array.length < index) return array;
  return array.filter((_, i) => i !== array.length - index);
};
