export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;

    const achievements = await prisma.studentAchievement.findMany({
      where: {
        studentId,
      },
      orderBy: {
        achievedAt: "desc",
      },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["student", "STUDENT", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { studentId, type, title, description, metadata } = body;

    if (!studentId || !type || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const achievement = await prisma.studentAchievement.create({
      data: {
        studentId,
        type,
        title,
        description,
        metadata,
        schoolId,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}
