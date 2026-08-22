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
    const assignmentId = parseInt(id);

    const body = await request.json();
    const { title, description, lessonId, startDate, dueDate, maxMarks, instructions, status } = body;

    // Verify the assignment belongs to this teacher
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        lesson: {
          teacherId,
          schoolId,
        },
      },
      include: {
        lesson: true,
      },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Assignment not found or unauthorized" },
        { status: 404 }
      );
    }

    // If lessonId is being changed, verify the new lesson belongs to this teacher
    if (lessonId && lessonId !== existingAssignment.lessonId) {
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
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      if (start >= due) {
        return NextResponse.json(
          { error: "Start date must be before due date" },
          { status: 400 }
        );
      }
    }

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        description,
        lessonId,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        maxMarks,
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
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      lessonId: assignment.lessonId,
      lessonName: assignment.lesson?.name || "",
      className: assignment.lesson?.class?.name || "",
      subjectName: assignment.lesson?.subject?.name || "",
      startDate: assignment.startDate.toISOString(),
      dueDate: assignment.dueDate.toISOString(),
      maxMarks: assignment.maxMarks,
      instructions: assignment.instructions,
      status: assignment.status,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
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
    const assignmentId = parseInt(id);

    // Verify the assignment belongs to this teacher
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        lesson: {
          teacherId,
          schoolId,
        },
      },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Assignment not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}