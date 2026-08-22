export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const exams = await prisma.exam.findMany({
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
            results: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    const formattedExams = exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      lessonId: exam.lessonId,
      lessonName: exam.lessonName || exam.lesson?.name || "Custom Lesson",
      className: exam.lesson?.class?.name || "N/A",
      subjectName: exam.lesson?.subject?.name || "N/A",
      startTime: exam.startTime.toISOString(),
      endTime: exam.endTime.toISOString(),
      maxMarks: exam.maxMarks,
      passingMarks: exam.passingMarks,
      instructions: exam.instructions,
      status: exam.status,
      resultsCount: exam._count.results,
    }));

    return NextResponse.json(formattedExams);
  } catch (error: any) {
    console.error("[GET /api/teacher/exams]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

    const body = await request.json();
    const { title, lessonName, startTime, endTime, maxMarks, passingMarks, instructions } = body;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    if (!lessonName) {
      return NextResponse.json(
        { error: "Lesson name is required" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    if (passingMarks > maxMarks) {
      return NextResponse.json(
        { error: "Passing marks cannot exceed max marks" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        lessonName,
        startTime: start,
        endTime: end,
        maxMarks: maxMarks || 100,
        passingMarks: passingMarks || 40,
        instructions,
        status: "SCHEDULED",
        schoolId,
        teacherId,
      },
    });

    return NextResponse.json({
      id: exam.id,
      title: exam.title,
      lessonName: exam.lessonName,
      startTime: exam.startTime.toISOString(),
      endTime: exam.endTime.toISOString(),
      maxMarks: exam.maxMarks,
      passingMarks: exam.passingMarks,
      instructions: exam.instructions,
      status: exam.status,
    });
  } catch (error: any) {
    console.error("[POST /api/teacher/exams]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create exam" },
      { status: 500 }
    );
  }
}