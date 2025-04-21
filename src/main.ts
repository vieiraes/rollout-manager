import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Definir timezone para o Node globalmente
  process.env.TZ = 'America/Sao_Paulo';
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  await app.listen(3344);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
