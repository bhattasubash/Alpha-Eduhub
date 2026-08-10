/**
 * POST /api/auth/logout
 * Deletes the refresh token from DB and clears both auth cookies.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearAuthCookies } from "@/lib/auth";
import { hashRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      // Delete from DB — ignore error if token doesn't exist
      const tokenHash = await hashRefreshToken(refreshToken);
      await prisma.refreshToken.deleteMany({ where: { OR: [{ tokenHash }, { token: refreshToken }] } });
    }

    const res = NextResponse.redirect(new URL("/sign-in", req.url));
    clearAuthCookies(res);
    return res;
  } catch (err) {
    console.error("[POST /api/auth/logout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
