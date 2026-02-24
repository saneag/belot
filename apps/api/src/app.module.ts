import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "src/config/configuration";

import { GameModule } from "./game/game.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
