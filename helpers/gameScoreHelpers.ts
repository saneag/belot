import {
  DEFAULT_ROUND_POINTS,
  ROUND_POINTS_INDEX,
} from '../constants/gameConstants';
import { GameScore, PlayersScore } from '../types/game';

export const prepareEmptyRoundScore = (playersCount: number): PlayersScore => {
  const players = Array.from({ length: playersCount !== 4 ? playersCount : 2 });
  const rawScore = players.reduce((acc: Record<string, string>, _, index) => {
    acc[index.toString()] = '0';
    return acc;
  }, {});

  rawScore[ROUND_POINTS_INDEX] = String(DEFAULT_ROUND_POINTS);

  return rawScore;
};

export const prepareEmptyScoreRow = (
  playersCount: number,
  rowIndex: number
): GameScore => {
  return {
    [rowIndex.toString()]: prepareEmptyRoundScore(playersCount),
  };
};
