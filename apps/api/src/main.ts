import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get(ConfigService);

  const port: number | undefined = configService.get<number>("port");

  if (!port) {
    throw new Error("Port is not defined");
  }

  await app.listen(port);
}

bootstrap();
