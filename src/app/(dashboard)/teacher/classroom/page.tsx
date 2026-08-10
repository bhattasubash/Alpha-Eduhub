import TeacherWorkspace from "@/components/TeacherWorkspace";
import prisma from "@/lib/prisma";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ClassroomPage = async ({
  searchParams,
}: {
  searchParams: { tab?: string };
}) => {
  await requireSession(["teacher", "TEACHER", "admin", "SCHOOL_ADMIN"]);
  const teacherId = (await getCurrentUserId()) ?? "";

  const validTabs = ["attendance", "marks", "discipline"] as const;
  const initialTab = validTabs.includes(searchParams.tab as typeof validTabs[number])
    ? (searchParams.tab as typeof validTabs[number])
    : "attendance";

  let lessons: { id: number; name: string; classId: number; className: string }[] = [];
  let students: { id: string; name: string; surname: string; classId: number }[] = [];
  let exams: { id: number; title: string; lessonId: number | null }[] = [];
  let assignments: { id: number; title: string; lessonId: number | null }[] = [];
  let disciplineRecords: {
    id: number;
    date: string;
    type: string;
    description: string;
    student: { name: string; surname: string };
  }[] = [];

  try {
    const [lessonRows, studentRows, examRows, assignmentRows, discRows] = await Promise.all([
      prisma.lesson.findMany({
        where: { teacherId },
        select: { id: true, name: true, classId: true, class: { select: { name: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.student.findMany({
        where: { class: { lessons: { some: { teacherId } } } },
        select: { id: true, name: true, surname: true, classId: true },
        orderBy: [{ name: "asc" }, { surname: "asc" }],
      }),
      prisma.exam.findMany({
        where: { lesson: { teacherId } },
        select: { id: true, title: true, lessonId: true },
        orderBy: { startTime: "desc" },
      }),
      prisma.assignment.findMany({
        where: { lesson: { teacherId } },
        select: { id: true, title: true, lessonId: true },
        orderBy: { dueDate: "desc" },
      }),
      prisma.discipline.findMany({
        where: { teacherId },
        include: { student: { select: { name: true, surname: true } } },
        orderBy: { date: "desc" },
        take: 20,
      }),
    ]);

    lessons = lessonRows.map((l) => ({
      id: l.id,
      name: l.name,
      classId: l.classId,
      className: l.class.name,
    }));
    students = studentRows;
    exams = examRows.filter(e => e.lessonId !== null);
    assignments = assignmentRows.filter(a => a.lessonId !== null);
    disciplineRecords = discRows.map((d) => ({
      id: d.id,
      date: d.date.toISOString(),
      type: d.type,
      description: d.description,
      student: d.student,
    }));
  } catch {
    /* DB offline — empty lists, component shows helpful empty states */
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/teacher"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-gradient-to-r from-lamaPurple to-lamaSky rounded-2xl p-5">
        <h1 className="text-2xl font-bold text-gray-800">My Classroom</h1>
        <p className="text-sm text-gray-600 mt-1">
          Mark attendance, upload marks, and manage student discipline — all in one place.
        </p>
      </div>

      <TeacherWorkspace
        students={students}
        lessons={lessons}
        exams={exams}
        assignments={assignments}
        disciplineRecords={disciplineRecords}
        initialTab={initialTab}
      />
    </div>
  );
};

export default ClassroomPage;
