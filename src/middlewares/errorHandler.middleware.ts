import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorResponse(err.message)
    );
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json(
      errorResponse('Validation error', errors)
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      return res.status(409).json(
        errorResponse(`${field} already exists`)
      );
    }

    if (err.code === 'P2025') {
      return res.status(404).json(
        errorResponse('Record not found')
      );
    }

    return res.status(400).json(
      errorResponse('Database operation failed')
    );
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      errorResponse('Invalid token')
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      errorResponse('Token expired')
    );
  }

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';

  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};