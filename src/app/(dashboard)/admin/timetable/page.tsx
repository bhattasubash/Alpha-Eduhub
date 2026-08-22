import { guardSchoolAdmin } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, GraduationCap, ArrowRight } from "lucide-react";
import TimetableGrid from "@/components/TimetableGrid";
import { saveTimetableEntry, deleteTimetableEntry } from "@/lib/timetableActions";

export const dynamic = 'force-dynamic';

const DAY_COLORS: Record<string, string> = {
  MONDAY:    "bg-blue-500",
  TUESDAY:   "bg-purple-500",
  WEDNESDAY: "bg-emerald-500",
  THURSDAY:  "bg-amber-500",
  FRIDAY:    "bg-rose-500",
};

const AdminTimetablePage = async ({
  searchParams,
}: {
  searchParams: { classId?: string };
}) => {
  const session = await guardSchoolAdmin();
  const schoolId = session.schoolId || "";
  const selectedClassId = searchParams.classId ? parseInt(searchParams.classId) : null;

  let classes: any[] = [];
  let subjects: any[] = [];
  let teachers: any[] = [];

  try {
    classes = await prisma.class.findMany({
      where: schoolId ? { schoolId } : {},
      include: {
        grade: { select: { level: true } },
        _count: { select: { students: true } },
      },
      orderBy: [{ grade: { level: "asc" } }, { name: "asc" }],
    });

    [subjects, teachers] = await Promise.all([
      prisma.subject.findMany({ where: schoolId ? { schoolId } : {}, orderBy: { name: "asc" } }),
      prisma.teacher.findMany({
        where: schoolId ? { schoolId } : {},
        select: { id: true, name: true, surname: true },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (err) {
    console.error("Error loading timetable options:", err);
  }

  // Load lessons for the selected class
  let lessons: Awaited<ReturnType<typeof prisma.lesson.findMany>> = [];
  let selectedClass: (typeof classes)[number] | null = null;

  if (selectedClassId && schoolId) {
    try {
      selectedClass = classes.find((c) => c.id === selectedClassId) || null;
      lessons = await prisma.lesson.findMany({
        where: { classId: selectedClassId, ...(schoolId ? { schoolId } : {}) },
        include: {
          subject: { select: { name: true } },
          teacher: { select: { id: true, name: true, surname: true } },
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
      });
    } catch (err) {
      console.error("Error loading class lessons:", err);
    }
  }

  // Summary: filled periods per class
  const classSummaries = await Promise.all(
    classes.map(async (cls) => {
      try {
        const count = await prisma.lesson.count({ where: { classId: cls.id, ...(schoolId ? { schoolId } : {}) } });
        return { id: cls.id, lessonCount: count };
      } catch {
        return { id: cls.id, lessonCount: 0 };
      }
    })
  );
  const summaryMap = Object.fromEntries(classSummaries.map((s) => [s.id, s.lessonCount]));

  return (
    <div className="p-4 max-w-7xl mx-auto w-full space-y-5">
      {/* PAGE HEADER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timetable Manager</h1>
            <p className="text-sm text-gray-500">
              Select a class → assign subjects &amp; teachers per period. Students &amp; teachers see updates instantly.
            </p>
          </div>
        </div>
        {selectedClassId && (
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-indigo-700">Class {selectedClass?.name}</span>
            <span className="text-xs text-indigo-400">Grade {selectedClass?.grade?.level}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* LEFT: CLASS SELECTOR */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden self-start">
          <div className="p-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              Classes ({classes.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
            {classes.length === 0 && (
              <div className="p-8 text-center">
                <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No classes yet.</p>
                <Link href="/list/classes" className="text-xs text-blue-500 hover:underline mt-1 block">
                  Create a class →
                </Link>
              </div>
            )}
            {classes.map((cls) => {
              const isActive = selectedClassId === cls.id;
              const lessonCount = summaryMap[cls.id] ?? 0;
              return (
                <Link
                  key={cls.id}
                  href={`/admin/timetable?classId=${cls.id}`}
                  className={`flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors group ${
                    isActive ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                      ${isActive ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {cls.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isActive ? "text-indigo-700" : "text-gray-800"}`}>
                        Class {cls.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Gr.{cls.grade?.level} · {cls._count.students} students · {lessonCount} periods
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-400" : "text-gray-300 group-hover:text-gray-400"}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TIMETABLE GRID */}
        <div className="lg:col-span-3">
          {!selectedClassId ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center mb-5">
                <CalendarDays className="w-12 h-12 text-indigo-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Select a Class to Begin</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                Choose a class from the left panel. You can then assign subjects and teachers to each period for every day of the week.
              </p>

              {/* Quick preview of day colors */}
              <div className="flex gap-2 mt-6">
                {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"].map((d) => (
                  <div key={d} className={`w-8 h-2 rounded-full ${DAY_COLORS[d]}`} />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Mon — Fri</p>
            </div>
          ) : (
            <TimetableGrid
              classId={selectedClassId}
              className={selectedClass?.name ?? ""}
              schoolId={schoolId}
              subjects={subjects}
              teachers={teachers}
              lessons={lessons as any}
              saveTimetableAction={saveTimetableEntry}
              deleteLessonAction={deleteTimetableEntry}
            />
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5">
        <h3 className="font-bold text-indigo-800 mb-3">How Timetable Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Select Class", desc: "Pick any class from the left panel to open its weekly timetable grid." },
            { step: "2", title: "Assign Subjects", desc: "Click the + in any period cell. Choose a subject and a teacher, then click Save." },
            { step: "3", title: "Auto-Propagates", desc: "Students of that class instantly see updated schedules. Teachers see their complete session list across all classes." },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {s.step}
              </div>
              <div>
                <p className="font-semibold text-indigo-800 text-sm">{s.title}</p>
                <p className="text-xs text-indigo-600 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTimetablePage;
