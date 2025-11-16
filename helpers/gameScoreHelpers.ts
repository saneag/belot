import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import { GameScore } from '../types/game';
import { Player } from '../types/players';
import { getPlayersCount } from './playerNamesHelpers';

export const prepareFirstScoreRow = (score: GameScore[], players: Player[]) => {
  const playersScores = players.map((player) => {
    return {
      ...player,
      score: 0,
    };
  });

  if (score.length === 0) {
    return [
      {
        id: 0,
        playersScores,
        roundPlayer: null,
        totalRoundScore: DEFAULT_ROUND_POINTS,
      },
    ];
  }
};

export const prepareEmptyScoreRow = (
  score: GameScore[],
  players: Player[]
): GameScore[] => {
  const currentDealerIndex = players.findIndex((player) => player.isDealer);

  if (currentDealerIndex === -1) {
    return [];
  }

  const playersCount = getPlayersCount(players);
  const playerIndexToUpdate =
    currentDealerIndex + 1 === playersCount ? 0 : currentDealerIndex + 1;

  const lastScore = score.at(-1) || {
    id: 0,
  };

  return [
    {
      id: lastScore?.id + 1,
      roundPlayer: null,
      playersScores: players.map((player, index) => {
        return {
          ...player,
          isDealer: index === playerIndexToUpdate,
          score: 0,
        };
      }),
      totalRoundScore: DEFAULT_ROUND_POINTS,
    },
  ];
};
