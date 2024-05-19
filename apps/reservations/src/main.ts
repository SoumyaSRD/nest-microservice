import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { ReservationsModule } from './reservations.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  const config = new DocumentBuilder()
    .setTitle('Nest Mongo')
    .setDescription('The Nest Mongo API description')
    .setVersion('1.0')
    .addTag('nest')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  app.useLogger(new Logger());
  await app.listen(3001);
}
bootstrap();
