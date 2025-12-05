import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerSetup } from './config/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerSetup(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  await app.listen(port ?? 5000);
}

bootstrap();
