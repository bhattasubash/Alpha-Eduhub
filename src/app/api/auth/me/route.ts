export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateUser, unauthorized } from "@/lib/apiMiddleware";

export async function GET(req: NextRequest) {
  const session = await authenticateUser(req);
  if (!session) return unauthorized();

  try {
    // For development/testing - return session data directly
    // const user = await prisma.user.findUnique({
    //   where: { id: session.userId },
    //   select: {
    //     id:       true,
    //     username: true,
    //     email:    true,
    //     role:     true,
    //     // isActive: true,
    //     schoolId: true,
    //     school:   { select: { id: true, name: true } },
    //   },
    // });

    // if (!user /* || !user.isActive */) return unauthorized("User not found");

    const user = {
      id: session.userId,
      username: session.username,
      email: `${session.username}@demo.com`,
      role: session.role,
      schoolId: session.schoolId,
      school: { id: "demo-school", name: "Demo School" }
    };

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[GET /api/auth/me]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
