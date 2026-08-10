import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const diaryEntries = await prisma.classDiary.findMany({
      where: {
        teacherId,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    const formattedEntries = diaryEntries.map((entry) => ({
      id: entry.id,
      date: entry.date.toISOString(),
      classId: entry.classId,
      className: entry.class.name,
      topicsCovered: entry.topicsCovered,
      homeworkGiven: entry.homeworkGiven,
      studentBehaviour: entry.studentBehaviour,
      specialNotes: entry.specialNotes,
      createdAt: entry.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedEntries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch diary entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const body = await request.json();
    const { date, classId, topicsCovered, homeworkGiven, studentBehaviour, specialNotes } = body;

    if (!date || !classId || !topicsCovered) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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

    // Create the diary entry
    const diaryEntry = await prisma.classDiary.create({
      data: {
        date: new Date(date),
        classId: parseInt(classId),
        topicsCovered,
        homeworkGiven,
        studentBehaviour,
        specialNotes,
        teacherId,
        schoolId: teacher.schoolId,
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
      id: diaryEntry.id,
      date: diaryEntry.date.toISOString(),
      classId: diaryEntry.classId,
      className: diaryEntry.class.name,
      topicsCovered: diaryEntry.topicsCovered,
      homeworkGiven: diaryEntry.homeworkGiven,
      studentBehaviour: diaryEntry.studentBehaviour,
      specialNotes: diaryEntry.specialNotes,
      createdAt: diaryEntry.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating diary entry:", error);
    return NextResponse.json(
      { error: "Failed to create diary entry" },
      { status: 500 }
    );
  }
}
