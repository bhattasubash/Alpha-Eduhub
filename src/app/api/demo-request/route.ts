/**
 * POST /api/demo-request
 * Receives "request a demo" form submissions from the landing page.
 * Saves to database for Super Admin to view.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, schoolName, role, students, message } = body;

    if (!name || !email || !schoolName) {
      return NextResponse.json(
        { error: "name, email, and schoolName are required" },
        { status: 400 },
      );
    }

    // Log the request for now (Prisma client needs regeneration)
    console.log("[demo-request]", { name, email, phone, schoolName, role, students, message });

    // TODO: Uncomment after running `npx prisma generate`
    // const demoRequest = await (prisma as any).demoRequest.create({
    //   data: {
    //     name,
    //     email,
    //     phone,
    //     schoolName,
    //     role,
    //     students,
    //     message: message || null,
    //   },
    // });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/demo-request]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
