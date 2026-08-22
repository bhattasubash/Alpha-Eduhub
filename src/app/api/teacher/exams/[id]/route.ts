export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const examId = parseInt(id);

    const body = await request.json();
    const { title, lessonId, startTime, endTime, maxMarks, passingMarks, instructions, status } = body;

    // Verify the exam belongs to this teacher
    const existingExam = await prisma.exam.findFirst({
      where: {
        id: examId,
        lesson: {
          teacherId,
          schoolId,
        },
      },
      include: {
        lesson: true,
      },
    });

    if (!existingExam) {
      return NextResponse.json(
        { error: "Exam not found or unauthorized" },
        { status: 404 }
      );
    }

    // If lessonId is being changed, verify the new lesson belongs to this teacher
    if (lessonId && lessonId !== existingExam.lessonId) {
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          teacherId,
          schoolId,
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found or unauthorized" },
          { status: 404 }
        );
      }
    }

    // Validate dates if provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start >= end) {
        return NextResponse.json(
          { error: "Start time must be before end time" },
          { status: 400 }
        );
      }
    }

    if (maxMarks && passingMarks && passingMarks > maxMarks) {
      return NextResponse.json(
        { error: "Passing marks cannot exceed max marks" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title,
        lessonId,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        maxMarks,
        passingMarks,
        instructions,
        status,
      },
      include: {
        lesson: {
          select: {
            name: true,
            class: {
              select: { name: true },
            },
            subject: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      id: exam.id,
      title: exam.title,
      lessonId: exam.lessonId,
      lessonName: exam.lesson?.name || "",
      className: exam.lesson?.class?.name || "",
      subjectName: exam.lesson?.subject?.name || "",
      startTime: exam.startTime.toISOString(),
      endTime: exam.endTime.toISOString(),
      maxMarks: exam.maxMarks,
      passingMarks: exam.passingMarks,
      instructions: exam.instructions,
      status: exam.status,
    });
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { error: "Failed to update exam" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const examId = parseInt(id);

    // Verify the exam belongs to this teacher
    const existingExam = await prisma.exam.findFirst({
      where: {
        id: examId,
        lesson: {
          teacherId,
          schoolId,
        },
      },
    });

    if (!existingExam) {
      return NextResponse.json(
        { error: "Exam not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.exam.delete({
      where: { id: examId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json(
      { error: "Failed to delete exam" },
      { status: 500 }
    );
  }
}