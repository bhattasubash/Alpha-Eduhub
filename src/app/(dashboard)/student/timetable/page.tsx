import { getSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { CalendarDays } from "lucide-react";
import TimetableViewer, { type LessonForView } from "@/components/TimetableViewer";

export const dynamic = 'force-dynamic';

export default async function StudentTimetablePage() {
  const session = await getSession();
  if (!session) return <div className="p-8 text-center text-gray-500">Please sign in.</div>;

  const student = await prisma.student.findUnique({
    where: { id: session.userId },
    include: {
      class: { select: { id: true, name: true } },
      grade: { select: { level: true } },
    },
  });

  if (!student) return <div className="p-8 text-center text-gray-500">Student profile not found.</div>;

  const rawLessons = await prisma.lesson.findMany({
    where: { classId: student.classId, schoolId: student.schoolId },
    include: {
      subject: { select: { id: true, name: true } },
      teacher: { select: { name: true, surname: true } },
    },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  const lessons: LessonForView[] = rawLessons.map((l) => ({
    day: l.day,
    startTime: l.startTime.toISOString(),
    subjectId: l.subject.id,
    subjectName: l.subject.name,
    teacherName: `${l.teacher.name} ${l.teacher.surname}`,
  }));

  return (
    <div className="p-4 max-w-5xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <CalendarDays className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-sm text-gray-500">
            Class {student.class?.name} · Grade {student.grade?.level}
          </p>
        </div>
      </div>

      <TimetableViewer
        mode="student"
        schoolId={student.schoolId}
        lessons={lessons}
      />
    </div>
  );
}
