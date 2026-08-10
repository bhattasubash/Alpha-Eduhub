"use client";

import { useEffect, useState } from "react";
import { Clock, User, GraduationCap, Users, Coffee } from "lucide-react";

type Period = {
  uid: string;
  label: string;
  start: string;
  end: string;
  isBreak: boolean;
};

const DEFAULT_PERIODS: Period[] = [
  { uid: "p1",  label: "Period 1", start: "08:00", end: "08:45", isBreak: false },
  { uid: "p2",  label: "Period 2", start: "08:45", end: "09:30", isBreak: false },
  { uid: "p3",  label: "Period 3", start: "09:30", end: "10:15", isBreak: false },
  { uid: "br1", label: "Break",    start: "10:15", end: "10:30", isBreak: true  },
  { uid: "p4",  label: "Period 4", start: "10:30", end: "11:15", isBreak: false },
  { uid: "p5",  label: "Period 5", start: "11:15", end: "12:00", isBreak: false },
  { uid: "ln1", label: "Lunch",    start: "12:00", end: "12:45", isBreak: true  },
  { uid: "p6",  label: "Period 6", start: "12:45", end: "13:30", isBreak: false },
  { uid: "p7",  label: "Period 7", start: "13:30", end: "14:15", isBreak: false },
  { uid: "p8",  label: "Period 8", start: "14:15", end: "15:00", isBreak: false },
];

const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"] as const;
const DAY_SHORT: Record<string, string> = {
  MONDAY:"Mon",TUESDAY:"Tue",WEDNESDAY:"Wed",THURSDAY:"Thu",FRIDAY:"Fri",
};
const DAY_COLORS: Record<string, string> = {
  MONDAY:"bg-blue-500",TUESDAY:"bg-purple-500",WEDNESDAY:"bg-emerald-500",
  THURSDAY:"bg-amber-500",FRIDAY:"bg-rose-500",
};
const SUBJECT_COLORS = [
  "bg-blue-100 text-blue-800","bg-purple-100 text-purple-800",
  "bg-emerald-100 text-emerald-800","bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800","bg-indigo-100 text-indigo-800",
  "bg-teal-100 text-teal-800","bg-orange-100 text-orange-800",
];
function subjectColor(id: number) { return SUBJECT_COLORS[id % SUBJECT_COLORS.length]; }

export type LessonForView = {
  day: string;
  startTime: string; // ISO string
  subjectId: number;
  subjectName: string;
  teacherName: string;
  // teacher view extras
  className?: string;
  studentCount?: number;
};

interface StudentViewProps {
  mode: "student";
  schoolId: string;
  lessons: LessonForView[];
}
interface TeacherViewProps {
  mode: "teacher";
  schoolId: string;
  lessons: LessonForView[];
}
type Props = StudentViewProps | TeacherViewProps;

export default function TimetableViewer({ mode, schoolId, lessons }: Props) {
  const [periods, setPeriods] = useState<Period[]>(DEFAULT_PERIODS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`timetable_periods_${schoolId}`);
      if (stored) setPeriods(JSON.parse(stored));
    } catch {}
  }, [schoolId]);

  // Build grid: day → start → lesson
  type CellData = LessonForView;
  const grid: Record<string, Record<string, CellData>> = {};
  for (const lesson of lessons) {
    const t = new Date(lesson.startTime).toISOString().slice(11, 16);
    if (!grid[lesson.day]) grid[lesson.day] = {};
    grid[lesson.day][t] = lesson;
  }

  // Today
  const todayName = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][new Date().getDay()];
  const todayActivePeriods = periods.filter((p) => !p.isBreak && grid[todayName]?.[p.start]);

  return (
    <div className="space-y-5">
      {/* Today highlight */}
      {todayActivePeriods.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-4 text-white">
          <h3 className="font-bold mb-3 text-sm">
            Today&apos;s Classes ({todayName.charAt(0) + todayName.slice(1).toLowerCase()})
          </h3>
          <div className="flex flex-wrap gap-2">
            {todayActivePeriods.map((period) => {
              const lesson = grid[todayName][period.start];
              return (
                <div key={period.uid} className="bg-white/20 backdrop-blur rounded-xl px-3 py-2.5">
                  <p className="text-[10px] font-bold opacity-70">{period.start} – {period.end}</p>
                  <p className="font-bold text-sm">{lesson.subjectName}</p>
                  <p className="text-[10px] opacity-70">
                    {mode === "student" ? lesson.teacherName : `Class ${lesson.className} · ${lesson.studentCount} students`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[580px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-28 px-3 py-3 text-left text-xs font-bold text-gray-400 uppercase">Period</th>
              {DAYS.map((day) => (
                <th key={day} className="px-2 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-lg text-white text-xs font-bold ${DAY_COLORS[day]}`}>
                    {DAY_SHORT[day]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => {
              if (period.isBreak) {
                return (
                  <tr key={period.uid} className="bg-amber-50">
                    <td colSpan={6} className="px-3 py-2 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                        <Coffee className="w-3 h-3" />
                        {period.label} · {period.start}–{period.end}
                      </span>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={period.uid} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-2">
                    <p className="text-xs font-bold text-gray-700">{period.label}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {period.start}–{period.end}
                    </p>
                  </td>
                  {DAYS.map((day) => {
                    const lesson = grid[day]?.[period.start];
                    return (
                      <td key={day} className="px-2 py-2">
                        {lesson ? (
                          <div className={`rounded-xl px-2 py-2 ${subjectColor(lesson.subjectId)}`}>
                            <p className="text-[11px] font-bold truncate">{lesson.subjectName}</p>
                            {mode === "student" ? (
                              <div className="flex items-center gap-1 mt-0.5">
                                <User className="w-2.5 h-2.5 opacity-60 shrink-0" />
                                <p className="text-[9px] opacity-60 truncate">{lesson.teacherName}</p>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <GraduationCap className="w-2.5 h-2.5 opacity-60 shrink-0" />
                                  <p className="text-[9px] opacity-60 truncate">Class {lesson.className}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-2.5 h-2.5 opacity-40 shrink-0" />
                                  <p className="text-[9px] opacity-50">{lesson.studentCount} students</p>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                            <span className="text-[9px] text-gray-300">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
