import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Prisma Client Singleton
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  logger.info('Closing database connection...');
  await prisma.$disconnect();
});