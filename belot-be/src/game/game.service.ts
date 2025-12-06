import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { calculateRoundScore } from '@belot/shared';
import { CalculateRoundScoreDto } from './dto/calculate-round-score.dto';

@Injectable()
export class GameService {
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }

  calculateRoundScore(calculateRoundScoreDto: CalculateRoundScoreDto) {
    return calculateRoundScore(
      calculateRoundScoreDto.roundScore,
      calculateRoundScoreDto.roundPlayer,
    );
  }
}
