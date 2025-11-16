import { DimensionValue } from 'react-native';
import {
  DEFAULT_PLAYERS_COUNT,
  TABLE_HEIGHT,
  TABLE_WIDTH,
  TEAM_MEMBERS_MAP,
} from '../constants/gameConstants';
import { Player } from '../types/players';

export const getTopPosition = (
  index: number,
  playersCount: number
): DimensionValue => {
  const topPosition = -20;
  const bottomPosition = TABLE_HEIGHT - 50;
  const middlePosition = bottomPosition / 2 - 10;

  const layouts: Record<number, number[]> = {
    2: [topPosition, bottomPosition],
    3: [topPosition, middlePosition, bottomPosition],
    4: [topPosition, middlePosition, bottomPosition, middlePosition],
  };

  return layouts[playersCount]?.[index] ?? 'auto';
};

export const getRightPosition = (
  index: number,
  playersCount: number
): DimensionValue => {
  const defaultRightShift = 5;
  const middlePosition = TABLE_WIDTH / 2;

  const layouts: Record<number, number[]> = {
    2: [defaultRightShift, defaultRightShift],
    3: [defaultRightShift, -middlePosition, defaultRightShift],
    4: [defaultRightShift, -middlePosition, defaultRightShift, middlePosition],
  };

  return layouts[playersCount]?.[index] ?? 'auto';
};

export const setEmptyPlayers = (count = DEFAULT_PLAYERS_COUNT): Player[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    name: '',
    isDealer: index === 0,
    isRoundPlayer: false,
    ...(count === 4 && {
      teamMembers: {
        id: TEAM_MEMBERS_MAP[index],
      },
    }),
  }));
};

export const getPlayersNames = (players: Player[]) =>
  players.map((player) => player.name);

export const getPlayersCount = (players: Player[]) => players.length;

export const getDealer = (players: Player[]) =>
  players.find((player) => player.isDealer);

export const getRoundPlayer = (players: Player[]) =>
  players.find((player) => player.isRoundPlayer);
