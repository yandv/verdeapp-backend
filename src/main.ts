import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ allowedHeaders: '*', origin: '*', credentials: true });

  app.setGlobalPrefix('/api/v1');

  await app.listen(8080);
}

bootstrap();
