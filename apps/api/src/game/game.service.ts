import { Injectable } from "@nestjs/common";

import { CreateGameDto } from "src/game/dto/create-game.dto";

@Injectable()
export class GameService {
  async initGame(createGameDto: CreateGameDto) {}
}
