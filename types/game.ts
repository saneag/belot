import { BaseEntity } from './common';

export interface Player extends BaseEntity {
  name: string;
  teamId?: number;
}

export type GameMode = 'classic' | 'team';

export interface Team extends BaseEntity {
  playersIds: number[];
}

export interface RoundScore extends BaseEntity {
  playersScores: PlayerScore[];
  teamsScores: TeamScore[];
  totalRoundScore: number;
}

export interface PlayerScore extends BaseEntity {
  playerId: number;
  score: number;
}

export interface TeamScore extends BaseEntity {
  teamId: number;
  score: number;
}

export interface CalculateRoundScoreProps<T extends PlayerScore | TeamScore> {
  prevRoundScore: RoundScore;
  gameMode: GameMode;
  newScoreValue: number;
  opponent: T;
}
