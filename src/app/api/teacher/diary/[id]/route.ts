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
    const entryId = parseInt(params.id);

    const body = await request.json();
    const { date, classId, topicsCovered, homeworkGiven, studentBehaviour, specialNotes } = body;

    if (!date || !classId || !topicsCovered) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the entry belongs to this teacher
    const existingEntry = await prisma.classDiary.findFirst({
      where: {
        id: entryId,
        teacherId,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Diary entry not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get teacher's school ID
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { schoolId: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Verify the teacher teaches this class
    const classExists = await prisma.class.findFirst({
      where: {
        id: parseInt(classId),
        schoolId: teacher.schoolId,
        lessons: {
          some: {
            teacherId,
          },
        },
      },
    });

    if (!classExists) {
      return NextResponse.json(
        { error: "Class not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the diary entry
    const updatedEntry = await prisma.classDiary.update({
      where: { id: entryId },
      data: {
        date: new Date(date),
        classId: parseInt(classId),
        topicsCovered,
        homeworkGiven,
        studentBehaviour,
        specialNotes,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updatedEntry.id,
      date: updatedEntry.date.toISOString(),
      classId: updatedEntry.classId,
      className: updatedEntry.class.name,
      topicsCovered: updatedEntry.topicsCovered,
      homeworkGiven: updatedEntry.homeworkGiven,
      studentBehaviour: updatedEntry.studentBehaviour,
      specialNotes: updatedEntry.specialNotes,
      createdAt: updatedEntry.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating diary entry:", error);
    return NextResponse.json(
      { error: "Failed to update diary entry" },
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
    const entryId = parseInt(params.id);

    // Verify the entry belongs to this teacher
    const existingEntry = await prisma.classDiary.findFirst({
      where: {
        id: entryId,
        teacherId,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Diary entry not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the diary entry
    await prisma.classDiary.delete({
      where: { id: entryId },
    });

    return NextResponse.json({
      success: true,
      message: "Diary entry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return NextResponse.json(
      { error: "Failed to delete diary entry" },
      { status: 500 }
    );
  }
}
