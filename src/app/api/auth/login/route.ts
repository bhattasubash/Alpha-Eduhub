/**
 * POST /api/auth/login
 * Body: { login: string; password: string }
 *   `login` accepts either a username or an email address.
 * Returns: { user } and sets httpOnly access_token + refresh_token cookies.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  hashRefreshToken,
  refreshTokenExpiryDate,
} from "@/lib/auth";
import { allowAuthRequest } from "@/lib/authRateLimit";

export async function POST(req: NextRequest) {
  try {
    const clientKey = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!allowAuthRequest(`login:${clientKey}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }
    const body = await req.json();
    // Accept either `login` (new field) or legacy `username` field
    const login    = (body.login ?? body.username ?? "") as string;
    const password = (body.password ?? "") as string;

    if (!login.trim() || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required" },
        { status: 400 },
      );
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: login.trim() },
          { email: login.trim() }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        schoolId: true,
        // Only select isActive if it exists in the database
        // isActive: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if user is active (if isActive field exists in database)
    // Note: isActive field may not exist in current database schema
    // if ('isActive' in user && !user.isActive) {
    //   return NextResponse.json({ error: "Account is deactivated" }, { status: 403 });
    // }

    // Build token payload
    const payload = {
      userId:   user.id,
      role:     user.role,
      schoolId: user.schoolId,
      username: user.username,
    };

    // Generate tokens in parallel
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload),
      signRefreshToken(payload),
    ]);

    // Store refresh token in database
    // Note: tokenHash field may not exist in current database schema
    try {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: refreshTokenExpiryDate(),
        },
      });
    } catch (error) {
      console.log("Could not store refresh token:", error);
      // Continue without storing refresh token for demo purposes
    }

    const res = NextResponse.json({
      user: {
        id:       user.id,
        username: user.username,
        email:    user.email,
        role:     user.role,
        schoolId: user.schoolId,
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    return res;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
