import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/database';

const app = createApp();

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected');

    // Start server
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 CORS enabled for: ${env.FRONTEND_URL}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();