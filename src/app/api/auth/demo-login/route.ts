export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";

// Demo user configurations - these bypass normal authentication
const DEMO_USERS = {
  "demo.superadmin@alphaeduhub.com": {
    id: "demo-super-admin-001",
    username: "demo.superadmin@alphaeduhub.com",
    email: "demo.superadmin@alphaeduhub.com",
    role: "SUPER_ADMIN",
    schoolId: null,
    school: null
  },
  "demo.admin@alphaeduhub.com": {
    id: "demo-admin-001",
    username: "demo.admin@alphaeduhub.com",
    email: "demo.admin@alphaeduhub.com",
    role: "SCHOOL_ADMIN",
    schoolId: "demo-school-001",
    school: { id: "demo-school-001", name: "Alpha Edu Hub Demo School" }
  },
  "demo.teacher@alphaeduhub.com": {
    id: "demo-teacher-001",
    username: "demo.teacher@alphaeduhub.com",
    email: "demo.teacher@alphaeduhub.com",
    role: "TEACHER",
    schoolId: "demo-school-001",
    school: { id: "demo-school-001", name: "Alpha Edu Hub Demo School" }
  },
  "demo.student@alphaeduhub.com": {
    id: "demo-student-001",
    username: "demo.student@alphaeduhub.com",
    email: "demo.student@alphaeduhub.com",
    role: "STUDENT",
    schoolId: "demo-school-001",
    school: { id: "demo-school-001", name: "Alpha Edu Hub Demo School" }
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if the requested user is a demo user
    const demoUser = DEMO_USERS[username as keyof typeof DEMO_USERS];
    
    if (!demoUser) {
      return NextResponse.json(
        { error: "Demo user not found" },
        { status: 404 }
      );
    }

    // Create tokens directly without database authentication
    const accessToken = await signAccessToken({
      userId: demoUser.id,
      role: demoUser.role,
      schoolId: demoUser.schoolId,
      username: demoUser.username
    });

    const refreshToken = await signRefreshToken({
      userId: demoUser.id,
      role: demoUser.role,
      schoolId: demoUser.schoolId,
      username: demoUser.username
    });

    // Set auth cookies
    const response = NextResponse.json({
      user: demoUser,
      message: "Demo login successful"
    });

    setAuthCookies(response, accessToken, refreshToken);

    return response;

  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Demo login failed" },
      { status: 500 }
    );
  }
}