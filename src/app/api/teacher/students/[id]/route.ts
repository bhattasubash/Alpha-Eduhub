import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const studentId = params.id;

    // Verify teacher has access to this student (student must be in one of teacher's lessons' classes)
    const hasAccess = await prisma.student.findFirst({
      where: {
        id: studentId,
        class: {
          lessons: {
            some: { teacherId },
          },
        },
      },
    });

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Student not found or unauthorized" },
        { status: 403 }
      );
    }

    // Fetch student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        birthday: true,
        admissionNumber: true,
        rollNumber: true,
        classId: true,
        class: { select: { name: true } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Fetch attendance records (only for lessons taught by this teacher)
    const attendance = await prisma.attendance.findMany({
      where: {
        studentId,
        lesson: { teacherId },
      },
      orderBy: { date: "desc" },
      take: 30,
    });

    // Fetch marks/results for exams created by this teacher
    const results = await prisma.result.findMany({
      where: {
        studentId,
        exam: { teacherId },
      },
      include: {
        exam: {
          include: {
            lesson: { select: { subject: { select: { name: true } } } },
          },
        },
      },
      orderBy: { id: "desc" },
      take: 20,
    });

    // Fetch discipline records by this teacher
    const discipline = await prisma.discipline.findMany({
      where: { studentId, teacherId },
      orderBy: { date: "desc" },
      take: 10,
    });

    const formattedStudent = {
      student: {
        id: student.id,
        name: student.name,
        surname: student.surname,
        email: student.email ?? undefined,
        phone: student.phone ?? undefined,
        birthday: student.birthday?.toISOString() ?? undefined,
        className: student.class?.name ?? "Unknown",
        rollNumber: student.rollNumber ?? student.admissionNumber ?? undefined,
      },
      attendance: attendance.map((a) => ({
        date: a.date.toISOString(),
        present: a.present,
      })),
      marks: results.map((r) => ({
        subject: r.exam?.lesson?.subject?.name ?? "Unknown",
        exam: r.exam?.title ?? "Unknown",
        score: r.score,
        maxMarks: r.exam?.maxMarks ?? 100,
        percentage: r.percentage ?? Math.round((r.score / (r.exam?.maxMarks ?? 100)) * 100),
        grade: r.grade ?? null,
      })),
      behavior: discipline.map((d) => ({
        date: d.date.toISOString(),
        type: d.type,
        description: d.description,
      })),
    };

    return NextResponse.json(formattedStudent);
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Failed to fetch student data" },
      { status: 500 }
    );
  }
}
