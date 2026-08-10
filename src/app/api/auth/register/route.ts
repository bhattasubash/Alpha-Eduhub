/**
 * POST /api/auth/register  — Provider only.
 * Creates a new Provider-level user account.
 * Body: { username, email, password }
 *
 * After registration the provider can create schools and school admins
 * via separate admin APIs.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authenticateUser, authorizeRoles, unauthorized, badRequest } from "@/lib/apiMiddleware";

export async function POST(req: NextRequest) {
  try {
    // If the DB has zero provider accounts, allow open registration.
    // Otherwise, only an existing provider may create another provider.
    const existingProviders = await prisma.user.count({
      where: { role: "provider" },
    });

    if (existingProviders > 0) {
      // Must be an authenticated provider
      const session = await authenticateUser(req);
      if (!session) return unauthorized();
      const authErr = authorizeRoles(session, ["provider"]);
      if (authErr) return authErr;
    }

    const body = await req.json();
    const { username, email, password } = body as {
      username?: string;
      email?:    string;
      password?: string;
    };

    if (!username || !email || !password) {
      return badRequest("username, email, and password are required");
    }

    if (password.length < 8) {
      return badRequest("Password must be at least 8 characters");
    }

    // Uniqueness checks
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role:     "provider",
        schoolId: null,
      },
      select: { id: true, username: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
