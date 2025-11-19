import { BaseEntity } from './common';

export interface Player extends BaseEntity {
  name: string;
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
