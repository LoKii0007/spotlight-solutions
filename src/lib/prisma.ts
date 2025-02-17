import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = (() => {
  let prisma: PrismaClient | undefined = undefined;
  
  return () => {
    if (!prisma) {
      prisma = new PrismaClient();
    }
    return prisma;
  };
})();

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
