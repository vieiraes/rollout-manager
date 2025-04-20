import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  
  const port = process.env.PORT || 3000;
  console.log(`Application is running on port: ${port}`);
  
  await app.listen(port);
}
bootstrap();
