import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import env from './config/env';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongoUri'),
      }),
    }),

    UsersModule,

    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
