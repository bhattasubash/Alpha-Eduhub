export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const assignments = await prisma.assignment.findMany({
      where: {
        teacherId,
      },
      include: {
        lesson: {
          select: {
            name: true,
            class: {
              select: {
                name: true,
              },
            },
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
            results: true,
          },
        },
      },
      orderBy: { dueDate: "desc" },
    });

    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      lessonId: assignment.lessonId,
      lessonName: assignment.lessonName || assignment.lesson?.name || "Custom Lesson",
      className: assignment.lesson?.class?.name || "N/A",
      subjectName: assignment.lesson?.subject?.name || "N/A",
      startDate: assignment.startDate.toISOString(),
      dueDate: assignment.dueDate.toISOString(),
      maxMarks: assignment.maxMarks,
      instructions: assignment.instructions,
      status: assignment.status,
      submissionsCount: assignment._count.submissions,
      resultsCount: assignment._count.results,
    }));

    return NextResponse.json(formattedAssignments);
  } catch (error: any) {
    console.error("[GET /api/teacher/assignments]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, lessonName, startDate, dueDate, maxMarks, instructions } = body;

    if (!lessonName) {
      return NextResponse.json(
        { error: "Lesson name is required" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const due = new Date(dueDate);
    if (start >= due) {
      return NextResponse.json(
        { error: "Start date must be before due date" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        lessonName,
        startDate: start,
        dueDate: due,
        maxMarks: maxMarks || 100,
        instructions,
        status: "DRAFT",
        schoolId,
        teacherId,
      },
    });

    return NextResponse.json({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      lessonName: assignment.lessonName,
      startDate: assignment.startDate.toISOString(),
      dueDate: assignment.dueDate.toISOString(),
      maxMarks: assignment.maxMarks,
      instructions: assignment.instructions,
      status: assignment.status,
    });
  } catch (error: any) {
    console.error("[POST /api/teacher/assignments]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create assignment" },
      { status: 500 }
    );
  }
}