import { Player, RoundScore } from '@belot/shared';

export class CalculateRoundScoreDto {
  roundScore: RoundScore;
  roundPlayer: Player | null;
}
