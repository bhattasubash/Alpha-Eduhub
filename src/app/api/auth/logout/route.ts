export const dynamic = "force-dynamic";

/**
 * POST /api/auth/logout
 * Clears both auth cookies immediately for fast logout.
 * Token cleanup happens in background without blocking the response.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clearAuthCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    // Clear cookies immediately for fast response
    const res = NextResponse.json({ success: true });
    clearAuthCookies(res);

    // Delete token from DB in background (non-blocking)
    if (refreshToken) {
      // Don't await this - let it happen in background
      prisma.refreshToken.deleteMany({ 
        where: { token: refreshToken } 
      }).catch((error) => {
        // Silently handle errors - logout should succeed regardless
        console.log("Background token cleanup:", error);
      });
    }

    return res;
  } catch (err) {
    console.error("[POST /api/auth/logout]", err);
    // Still clear cookies even if everything else fails
    const res = NextResponse.json({ success: true });
    clearAuthCookies(res);
    return res;
  }
}
