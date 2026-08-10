"use client";

import { BookOpen, CalendarDays, GraduationCap, TrendingUp } from "lucide-react";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import BigCalendarContainer from "@/components/BigCalendarContainer";

interface Child {
  id: string;
  name: string;
  surname: string;
  admissionNumber?: string;
  rollNumber?: string;
  img?: string;
  class: { name: string; id: number } | null;
  grade: { level: number } | null;
  section?: string;
}

interface ChildStats {
  attendance: { percentage: number; present: number; total: number };
  academics: { overallPercentage: number; resultsCount: number };
  assignments: { pending: number; submissionsCount: number };
  exams: { upcoming: number };
  fees: { total: number; paid: number; pending: number; status: string };
}

interface ChildOverviewProps {
  child: Child;
  stats: ChildStats;
}

export default function ChildOverview({ child, stats }: ChildOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Child header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl px-5 py-4 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {child.img ? (
              <img
                src={child.img}
                alt={child.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              `${child.name[0]}${child.surname[0]}`
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              {child.name} {child.surname}
            </h3>
            <p className="text-sm text-gray-600">
              {child.admissionNumber && `ID: ${child.admissionNumber} · `}
              {child.grade ? `Grade ${child.grade.level}` : ""}
              {child.class?.name && ` · ${child.class.name}`}
              {child.section && ` · ${child.section}`}
            </p>
          </div>
          <div className="text-right">
            <StudentAttendanceCard id={child.id} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Academic</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.academics.overallPercentage}%
          </p>
          <p className="text-xs text-gray-500">Overall Score</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.attendance.percentage}%
          </p>
          <p className="text-xs text-gray-500">
            {stats.attendance.present}/{stats.attendance.total} days
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">Assignments</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.assignments.pending}
          </p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Exams</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.exams.upcoming}
          </p>
          <p className="text-xs text-gray-500">Upcoming</p>
        </div>
      </div>

      {/* Fee status */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Fee Status</h4>
            <p className="text-sm text-gray-500">
              Total: ${stats.fees.total} · Paid: ${stats.fees.paid}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              stats.fees.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {stats.fees.status === "PAID" ? "Paid" : `Pending: $${stats.fees.pending}`}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-3">
          {child.name}&apos;s Schedule
        </h2>
        <BigCalendarContainer type="classId" id={child.class?.id || 0} />
      </div>
    </div>
  );
}
