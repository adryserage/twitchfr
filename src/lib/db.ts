import { PrismaClient } from '@prisma/client';
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaGlobal = global as typeof global & {
  prisma: PrismaClient | undefined;
};

export const prisma = prismaGlobal.prisma || 
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

// Create a raw SQL client using neon
export const sql = neon(process.env.POSTGRES_URL_NON_POOLING!);
