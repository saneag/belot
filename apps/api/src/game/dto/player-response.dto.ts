import { BaseDto } from "src/common/dto/base.dto";

export class PlayerResponseDto extends BaseDto {
  name: string;
  teamId?: number;
}
