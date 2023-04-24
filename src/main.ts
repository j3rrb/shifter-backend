import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { nestCsrf, CsrfFilter } from 'ncsrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*', methods: ['POST', 'GET'] });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new CsrfFilter());
  app.use(nestCsrf());

  await app.listen(3000);
}

bootstrap();
