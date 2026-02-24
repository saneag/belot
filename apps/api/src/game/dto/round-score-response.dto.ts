import { PlayerScoreResponseDto } from "src/game/dto/player-score-response.dto";
import { TeamScoreResponseDto } from "src/game/dto/team-score-response.dto";

export class RoundScoreResponseDto {
  id: number;
  playersScores: PlayerScoreResponseDto[];
  teamsScores: TeamScoreResponseDto[];
  totalRoundScore: number;
}
