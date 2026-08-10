import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const homeworkId = parseInt(params.id);

    const body = await request.json();
    const { title, description, dueDate, lessonId, selectedClasses, attachments } = body;

    if (!title || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.assignment.findUnique({
      where: { id: homeworkId },
      select: { teacherId: true },
    });

    if (!existing || existing.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Homework not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update homework
    await prisma.assignment.update({
      where: { id: homeworkId },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        lessonId,
      },
    });

    return NextResponse.json({ success: true, message: "Homework updated successfully" });
  } catch (error) {
    console.error("Error updating homework:", error);
    return NextResponse.json(
      { error: "Failed to update homework" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const homeworkId = parseInt(params.id);

    // Verify ownership
    const existing = await prisma.assignment.findUnique({
      where: { id: homeworkId },
      select: { teacherId: true },
    });

    if (!existing || existing.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Homework not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.assignment.delete({
      where: { id: homeworkId },
    });

    return NextResponse.json({ success: true, message: "Homework deleted successfully" });
  } catch (error) {
    console.error("Error deleting homework:", error);
    return NextResponse.json(
      { error: "Failed to delete homework" },
      { status: 500 }
    );
  }
}
