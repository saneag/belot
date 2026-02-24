import { GameMode } from "@belot/types";

import { RoundScoreResponseDto } from "src/game/dto/round-score-response.dto";

import { BaseDto } from "../../common/dto/base.dto";
import { PlayerResponseDto } from "./player-response.dto";
import { TeamResponseDto } from "./team-response.dto";

export class GameResponseDto extends BaseDto {
  players: PlayerResponseDto[];
  teams: TeamResponseDto[];
  dealer: PlayerResponseDto | null;
  roundPlayer: PlayerResponseDto | null;
  roundsScores: RoundScoreResponseDto[];
  undoneRoundsScores: RoundScoreResponseDto[];
  mode: GameMode;
  hasPreviousGame: boolean;
}
