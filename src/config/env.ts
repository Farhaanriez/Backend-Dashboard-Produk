import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Validation
if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in .env');
}