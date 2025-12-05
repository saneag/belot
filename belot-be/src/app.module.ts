import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import env from './config/env';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
