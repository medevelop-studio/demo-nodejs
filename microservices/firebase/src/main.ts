import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';
import { Env } from './common/dictionary/env';
import { HttpExceptionFilter } from './common/exception/http-exception-filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Firebase')
    .setDescription('API for firebase in System')
    .setVersion('1.0')
    .addTag('user')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const optionsCors: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(optionsCors);

  await app.listen(Env.SERVICE_PORT);
}
bootstrap();
