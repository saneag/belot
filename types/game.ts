import { Player } from './players';

export interface PlayersScore extends Player {
  score: number;
}

export interface GameScore {
  id: number;
  totalRoundScore: number;
  roundPlayer: Player | null;
  playersScores: PlayersScore[];
}
