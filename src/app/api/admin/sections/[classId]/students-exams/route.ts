import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getActiveSchoolId, requireSession } from "@/lib/getRole";

export async function GET(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = await getActiveSchoolId();
    if (!schoolId) {
      return NextResponse.json({ error: "School context not found" }, { status: 400 });
    }
    const classId = parseInt(params.classId);

    if (!classId || isNaN(classId)) {
      return NextResponse.json({ students: [], exams: [], assignments: [] });
    }

    const [students, exams, assignments] = await Promise.all([
      prisma.student.findMany({
        where: { classId, ...(schoolId ? { schoolId } : {}) },
        select: { id: true, name: true, surname: true, rollNumber: true, username: true },
        orderBy: { name: "asc" },
      }),
      prisma.exam.findMany({
        where: {
          lesson: { classId },
          ...(schoolId ? { schoolId } : {}),
        },
        select: {
          id: true,
          title: true,
          maxMarks: true,
          lessonName: true,
          lesson: { select: { subject: { select: { name: true } } } },
          results: { select: { id: true, studentId: true, score: true } },
        },
        orderBy: { startTime: "desc" },
      }),
      prisma.assignment.findMany({
        where: {
          lesson: { classId },
          ...(schoolId ? { schoolId } : {}),
        },
        select: {
          id: true,
          title: true,
          maxMarks: true,
          lessonName: true,
          lesson: { select: { subject: { select: { name: true } } } },
          results: { select: { id: true, studentId: true, score: true } },
        },
        orderBy: { dueDate: "desc" },
      }),
    ]);

    return NextResponse.json({ students, exams, assignments });
  } catch (err) {
    console.error("[students-exams GET]", err);
    return NextResponse.json({ students: [], exams: [], assignments: [] }, { status: 500 });
  }
}
