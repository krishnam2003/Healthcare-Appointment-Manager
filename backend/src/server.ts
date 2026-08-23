import type { Server } from 'node:http';

import { createApplication } from './app';
import { environment } from './config/environment';
import { logger } from './config/logger';
import { prisma } from './config/prisma';
import { redis } from './config/redis';

const application = createApplication();

let server: Server | undefined;
let isShuttingDown = false;

async function start(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected');

    await redis.connect();
    logger.info('Redis connected');

    server = application.listen(
      environment.PORT,
      '0.0.0.0',
      () => {
        logger.info('API server started', {
          environment: environment.NODE_ENV,
          port: environment.PORT,
        });
      },
    );
  } catch (error: unknown) {
    logger.error('API server failed to start', { error });

    await Promise.allSettled([
      prisma.$disconnect(),
      redis.quit(),
    ]);

    process.exit(1);
  }
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info('Graceful shutdown started', {
    signal,
  });

  const forceShutdownTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out');
    process.exit(1);
  }, 10_000);

  forceShutdownTimer.unref();

  try {
    if (server !== undefined) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error !== undefined) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await Promise.all([
      prisma.$disconnect(),
      redis.quit(),
    ]);

    logger.info('Graceful shutdown completed');

    clearTimeout(forceShutdownTimer);
  } catch (error: unknown) {
    logger.error('Graceful shutdown failed', {
      error,
      signal,
    });

    clearTimeout(forceShutdownTimer);
    process.exit(1);
  }
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    void shutdown(signal).then(() => {
      process.exit(0);
    });
  });
}

void start();