import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Belot')
    .setVersion('1.0')
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, documentOptions);

  const options: SwaggerCustomOptions = {
    jsonDocumentUrl: 'swagger/json',
  };

  SwaggerModule.setup('api/swagger', app, documentFactory, options);
}
