export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        name: true,
        surname: true,
        schoolId: true,
        subjects: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId,
        schoolId: teacher.schoolId,
      },
      include: {
        subject: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      day: lesson.day.toString(), // Ensure day is returned as string
      startTime: lesson.startTime.toTimeString().slice(0, 5),
      endTime: lesson.endTime.toTimeString().slice(0, 5),
      subjectName: lesson.subject.name,
      className: lesson.class.name,
      studentCount: lesson.class._count.students,
    }));

    const uniqueSubjects = Array.from(new Set(formattedLessons.map((l) => l.subjectName)));
    const uniqueClasses = Array.from(new Set(formattedLessons.map((l) => l.className)));

    return NextResponse.json({
      lessons: formattedLessons,
      teacherName: `${teacher.name} ${teacher.surname}`,
      subjects: uniqueSubjects,
      classes: uniqueClasses,
    });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    );
  }
}
