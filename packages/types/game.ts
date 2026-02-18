import { BaseEntity } from "./common";

export enum GameMode {
  classic = "classic",
  teams = "teams",
}

export interface Player extends BaseEntity<number> {
  name: string;
  teamId?: number;
}

export interface Team extends BaseEntity<number> {
  playersIds: number[];
  name: string;
}

export interface BaseScore {
  score: number;
  boltCount: number;
  totalScore: number;
}

export interface RoundScore extends BaseEntity<number> {
  playersScores: PlayerScore[];
  teamsScores: TeamScore[];
  totalRoundScore: number;
}

export interface PlayerScore extends BaseEntity<number>, BaseScore {
  playerId: number;
}

export interface TeamScore extends BaseEntity<number>, BaseScore {
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
  roundScore: Pick<RoundScore, "playersScores" | "totalRoundScore">;
  roundPlayer?: Player | null;
  currentOpponent?: TeamScore | PlayerScore;
  shouldRoundScore?: boolean;
}
