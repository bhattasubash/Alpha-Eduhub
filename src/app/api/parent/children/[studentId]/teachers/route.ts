import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await requireSession(["PARENT"]);
    const parentId = session.userId;
    const schoolId = session.schoolId;
    const { studentId } = params;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    // Verify parent-child relationship
    const parentRelation = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (!parentRelation) {
      return NextResponse.json(
        { error: "Unauthorized: Child not linked to this parent" },
        { status: 403 }
      );
    }

    // Get student's class
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            supervisor: true,
          },
        },
        grade: {
          include: {
            classes: {
              include: {
                lessons: {
                  include: {
                    teacher: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Get unique teachers from class supervisor and lessons
    const teachers = new Map();

    // Add class teacher
    if (student.class?.supervisor) {
      teachers.set(student.class.supervisor.id, {
        id: student.class.supervisor.id,
        name: student.class.supervisor.name,
        surname: student.class.supervisor.surname,
        email: student.class.supervisor.email,
        role: "Class Teacher",
      });
    }

    // Add subject teachers
    student.grade?.classes.forEach((cls) => {
      cls.lessons.forEach((lesson) => {
        if (lesson.teacher) {
          teachers.set(lesson.teacher.id, {
            id: lesson.teacher.id,
            name: lesson.teacher.name,
            surname: lesson.teacher.surname,
            email: lesson.teacher.email,
            role: "Subject Teacher",
          });
        }
      });
    });

    return NextResponse.json(Array.from(teachers.values()));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
