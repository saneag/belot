import { PlayerResponseDto } from "src/game/dto/player-response.dto";
import { TeamResponseDto } from "src/game/dto/team-response.dto";

export class CreateGameDto {
  players: PlayerResponseDto[];
  teams: TeamResponseDto[];
}
