import { BaseEntity } from './common';

export interface Player extends BaseEntity {
  name: string;
  teamId?: number;
}

export enum GameMode {
  classic = 'classic',
  teams = 'teams',
}

export interface BaseScore {
  score: number;
  boltCount: number;
  totalScore: number;
}

export interface Team extends BaseEntity {
  playersIds: number[];
  name: string;
}

export interface RoundScore extends BaseEntity {
  playersScores: PlayerScore[];
  teamsScores: TeamScore[];
  totalRoundScore: number;
}

export interface PlayerScore extends BaseEntity, BaseScore {
  playerId: number;
}

export interface TeamScore extends BaseEntity, BaseScore {
  teamId: number;
}

export interface CalculateRoundScoreProps<T extends PlayerScore | TeamScore> {
  prevRoundScore: RoundScore;
  gameMode: GameMode;
  newScoreValue: number;
  opponent: T;
  roundPlayer?: Player | null;
}

export interface SumOpponentPlayersScoresProps {
  roundScore: Pick<RoundScore, 'playersScores' | 'totalRoundScore'>;
  roundPlayer?: Player | null;
  currentOpponent?: TeamScore | PlayerScore;
  shouldRoundScore?: boolean;
}
