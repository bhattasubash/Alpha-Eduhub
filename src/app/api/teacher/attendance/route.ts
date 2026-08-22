export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { triggerAttendanceAbsentNotification, triggerAttendanceThresholdNotification } from "@/lib/notificationTriggers";

function attendanceDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function teacherLesson(teacherId: string, lessonId: number) {
  return prisma.lesson.findFirst({
    where: { id: lessonId, teacherId },
    select: { id: true, classId: true, schoolId: true },
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const lessonId = Number(request.nextUrl.searchParams.get("lessonId"));
    const date = attendanceDate(request.nextUrl.searchParams.get("date"));
    if (!Number.isInteger(lessonId) || !date) return NextResponse.json({ error: "lessonId and date are required" }, { status: 400 });

    const lesson = await teacherLesson(session.userId, lessonId);
    if (!lesson || lesson.schoolId !== session.schoolId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const records = await prisma.attendance.findMany({
      where: { lessonId, date, schoolId: lesson.schoolId },
      select: { studentId: true, present: true },
    });
    return NextResponse.json({ records });
  } catch (error: any) {
    console.error("[GET /api/teacher/attendance]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    const { date: rawDate, lessonId: rawLessonId, records } = body as { date?: unknown; lessonId?: unknown; records?: unknown };
    const date = attendanceDate(rawDate);
    const lessonId = Number(rawLessonId);
    if (!date || !Number.isInteger(lessonId) || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "date, lessonId, and attendance records are required" }, { status: 400 });
    }

    const parsed = records.map((record) => record && typeof record === "object"
      ? { studentId: (record as { studentId?: unknown }).studentId, present: (record as { present?: unknown }).present }
      : null);
    if (parsed.some((record) => !record || typeof record.studentId !== "string" || typeof record.present !== "boolean")) {
      return NextResponse.json({ error: "Each record requires a studentId and boolean present value" }, { status: 400 });
    }
    const typedRecords = parsed as { studentId: string; present: boolean }[];
    const ids = typedRecords.map((record) => record.studentId);
    if (new Set(ids).size !== ids.length) return NextResponse.json({ error: "Duplicate student records are not allowed" }, { status: 400 });

    const lesson = await teacherLesson(session.userId, lessonId);
    if (!lesson || lesson.schoolId !== session.schoolId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const students = await prisma.student.findMany({
      where: { id: { in: ids }, classId: lesson.classId, schoolId: lesson.schoolId },
      select: { id: true },
    });
    if (students.length !== ids.length) return NextResponse.json({ error: "A student is not assigned to this lesson's class" }, { status: 403 });

    await prisma.$transaction(typedRecords.map((record) => prisma.attendance.upsert({
      where: { studentId_lessonId_date: { studentId: record.studentId, lessonId, date } },
      create: { studentId: record.studentId, lessonId, date, present: record.present, schoolId: lesson.schoolId },
      update: { present: record.present, schoolId: lesson.schoolId },
    })));

    const school = await prisma.school.findUnique({ where: { id: lesson.schoolId }, select: { attendanceThreshold: true } });
    const absentIds = typedRecords.filter((record) => !record.present).map((record) => record.studentId);
    await Promise.all(absentIds.map((studentId) => triggerAttendanceAbsentNotification(studentId, lesson.schoolId, date)));
    await Promise.all(ids.map(async (studentId) => {
      const total = await prisma.attendance.count({ where: { studentId, schoolId: lesson.schoolId } });
      const present = await prisma.attendance.count({ where: { studentId, schoolId: lesson.schoolId, present: true } });
      const percentage = total ? Math.round((present / total) * 100) : 100;
      if (percentage < (school?.attendanceThreshold ?? 75)) {
        await triggerAttendanceThresholdNotification(studentId, lesson.schoolId, percentage, school?.attendanceThreshold ?? 75);
      }
    }));

    return NextResponse.json({ success: true, message: "Attendance saved successfully" });
  } catch (error: any) {
    console.error("[POST /api/teacher/attendance]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save attendance" },
      { status: 500 }
    );
  }
}
