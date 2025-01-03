import { NestFactory } from '@nestjs/core';
import pino from 'pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(process.env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        }
      : {}),
  });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://cmwapp-fe.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Origin',
      'X-Requested-With',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global prefix
  app.setGlobalPrefix('api-v1');

  app.use((req, res, next) => {
    logger.info(
      {
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        headers: req.headers,
      },
      'Incoming request',
    );
    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.info(`Application is running on: http://localhost:${port}`);
  logger.info(
    'CORS configuration enabled with origin: https://cmwapp-fe.vercel.app',
  );
}
bootstrap();
