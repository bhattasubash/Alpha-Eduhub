import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal',
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

// Graceful shutdown for serverless environments
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
  })
  
  // Handle all possible process exits
  process.on('SIGINT', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
    process.exit(0)
  })
}