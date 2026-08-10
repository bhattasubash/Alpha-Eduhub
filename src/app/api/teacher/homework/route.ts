import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const homework = await prisma.assignment.findMany({
      where: {
        lesson: {
          teacherId,
        },
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
          },
        },
      },
      orderBy: { dueDate: "desc" },
    });

    const formattedHomework = homework.map((hw) => ({
      id: hw.id,
      title: hw.title,
      description: hw.description || "",
      dueDate: hw.dueDate.toISOString(),
      lessonId: hw.lessonId,
      lessonName: hw.lesson?.name ?? hw.lessonName ?? "Unknown",
      classes: hw.lesson?.class ? [hw.lesson.class.name] : [],
      attachments: [],
    }));

    return NextResponse.json(formattedHomework);
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json(
      { error: "Failed to fetch homework" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const body = await request.json();
    const { title, description, dueDate, lessonId, selectedClasses, attachments } = body;

    if (!title || !dueDate || !lessonId || !selectedClasses || selectedClasses.length === 0) {
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

    // Create homework for each selected class
    const homeworkPromises = selectedClasses.map((_classId: number) =>
      prisma.assignment.create({
        data: {
          title,
          description,
          startDate: new Date(),
          dueDate: new Date(dueDate),
          lessonId,
          teacherId,
          schoolId: teacher.schoolId,
        },
      })
    );

    await Promise.all(homeworkPromises);

    return NextResponse.json({ success: true, message: "Homework created successfully" });
  } catch (error) {
    console.error("Error creating homework:", error);
    return NextResponse.json(
      { error: "Failed to create homework" },
      { status: 500 }
    );
  }
}
