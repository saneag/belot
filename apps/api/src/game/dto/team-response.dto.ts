import { BaseDto } from "src/common/dto/base.dto";

export class TeamResponseDto extends BaseDto {
  name: string;
  playersIds: number[];
}
