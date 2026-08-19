import { PrismaClient } from '@prisma/client'
import { mockStudents, mockTeachers, mockClasses, mockAttendance, mockAnnouncements, mockEvents, mockAssignments, mockExams, mockResults, mockMessages, mockFees, mockLeaveRequests, mockSubjects, mockParents, mockTimetable, mockLessons } from './mockData'

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

// Test database connection on startup (force work mode - don't fail if connection fails)
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((error) => {
    console.log('⚠️ Database connection failed, using force work mode with mock data');
    // Don't throw error - allow app to continue with mock data
  })

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