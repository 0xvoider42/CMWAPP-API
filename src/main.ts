import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import pino from 'pino';

async function bootstrap() {
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api-v1');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.info(`Application is running on: http://localhost:${port}`);
}
bootstrap();
