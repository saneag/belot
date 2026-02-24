import { Body, Controller, Get, Post } from "@nestjs/common";

import { CreateGameDto } from "src/game/dto/create-game.dto";

import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getHello() {
    return "Hello World";
  }

  @Post("init")
  async initGame(@Body() createGameDto: CreateGameDto) {
    return await this.gameService.initGame(createGameDto);
  }
}
