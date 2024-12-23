import pino from 'pino';

export const createLogger = (context: string = 'Application') => {
  // Basic configuration that works in all environments
  const logConfig: pino.LoggerOptions = {
    level: process.env.LOG_LEVEL || 'info',
    base: {
      context,
      env: process.env.NODE_ENV,
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  };

  // Add pretty printing only in development
  if (process.env.NODE_ENV !== 'production') {
    logConfig.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    };
  }

  return pino(logConfig);
};
