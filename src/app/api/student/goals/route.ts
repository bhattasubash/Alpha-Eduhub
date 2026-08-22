export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;

    const goals = await prisma.studentGoal.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, title, targetValue, unit, deadline } = body;

    if (!type || !title || !targetValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const goal = await prisma.studentGoal.create({
      data: {
        studentId,
        type,
        title,
        targetValue: parseFloat(targetValue),
        unit,
        deadline: deadline ? new Date(deadline) : null,
        currentValue: 0,
        status: "ACTIVE",
        schoolId,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
