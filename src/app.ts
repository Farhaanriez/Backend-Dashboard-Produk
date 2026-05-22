import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { logger } from './utils/logger';
import authRoutes from './features/auth/routes/auth.routes';
import productsRoutes from './features/products/routes/products.routes';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use('/api/', apiLimiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use((req: Request, res: Response, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.info({
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
      });
    });

    next();
  });

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  app.use(errorHandler);

  return app;
};