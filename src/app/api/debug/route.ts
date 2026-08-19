/**
 * GET /api/debug
 * Debug endpoint to check environment and database connectivity
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    env_vars: {
      database_url: !!process.env.DATABASE_URL,
      jwt_access_secret: !!process.env.JWT_ACCESS_SECRET,
      jwt_refresh_secret: !!process.env.JWT_REFRESH_SECRET,
      cloudinary: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    database: {
      status: "unknown",
      error: null as string | null,
    },
    demo_users: [] as any[],
  };

  // Test database connection
  try {
    await prisma.$connect();
    debugInfo.database.status = "connected";
    
    // Try to find demo users
    const demoUsers = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: "admin" } },
          { username: { contains: "teacher" } },
          { username: { contains: "student" } },
          { email: { contains: "demo" } },
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        schoolId: true,
      },
      take: 10
    });
    
    debugInfo.demo_users = demoUsers;
  } catch (error: any) {
    debugInfo.database.status = "failed";
    debugInfo.database.error = error.message;
  }

  return NextResponse.json(debugInfo);
}