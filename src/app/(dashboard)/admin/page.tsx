import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { guardSchoolAdmin } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Ticket, CalendarDays, DollarSign, ArrowRight, GraduationCap, Users, CalendarCheck, FileSpreadsheet, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const session = await guardSchoolAdmin();
  const schoolId = session.schoolId || "";

  let openTickets = 0;
  let totalClasses = 0;
  let totalStudents = 0;
  let totalTeachers = 0;

  try {
    [openTickets, totalClasses, totalStudents, totalTeachers] = await Promise.all([
      prisma.supportTicket.count({ where: { ...(schoolId ? { schoolId } : {}), status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.class.count({ where: { ...(schoolId ? { schoolId } : {}) } }),
      prisma.student.count({ where: { ...(schoolId ? { schoolId } : {}) } }),
      prisma.teacher.count({ where: { ...(schoolId ? { schoolId } : {}) } }),
    ]);
  } catch (err) {
    console.error("Error loading admin dashboard stats:", err);
  }

  const collectedFees = 0;
  const pendingDues = 0;

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      {/* LEFT: MAIN OPERATIONS AREA */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">

        {/* TOP ROW: KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="admin" />
        </div>

        {/* WORKFLOW QUICK ACTIONS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Management Modules
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Quick Navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* TIMETABLE */}
            <Link
              href="/admin/timetable"
              className="group bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-blue-400 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <CalendarDays className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-3">Timetable</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Schedules & class allocations</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {totalClasses} Classes
                </span>
                <span className="text-[11px] text-blue-600 font-semibold">Active</span>
              </div>
            </Link>

            {/* FEES */}
            <Link
              href="/admin/fees"
              className="group bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-emerald-400 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <DollarSign className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-3">Fee Operations</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Tuition & collections tracking</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {totalStudents} Enrolled
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Ledger</span>
              </div>
            </Link>

            {/* LEAVE */}
            <Link
              href="/admin/leave"
              className="group bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-indigo-400 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <CalendarCheck className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-3">Leave Desk</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Staff & student approvals</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Faculty & Pupils</span>
                <span className="text-[11px] text-indigo-600 font-semibold">Review</span>
              </div>
            </Link>

            {/* BULK IMPORT */}
            <Link
              href="/admin/students/bulk"
              className="group bg-white rounded-xl border border-slate-200/80 p-4.5 hover:border-teal-400 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <FileSpreadsheet className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-3">Bulk Enrollment</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Spreadsheet roster import</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Excel / CSV</span>
                <span className="text-[11px] text-teal-600 font-semibold">Ready</span>
              </div>
            </Link>
          </div>
        </div>

        {/* OPERATIONS METRIC PILLS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{openTickets}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Support Requests</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{totalClasses}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Active Classrooms</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{totalTeachers}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Certified Instructors</p>
            </div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Demographic Ratios</h2>
              <span className="text-xs text-slate-400 font-medium">Students</span>
            </div>
            <CountChartContainer />
          </div>

          <div className="xl:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Attendance Metrics</h2>
              <span className="text-xs text-slate-400 font-medium">Weekly Trends</span>
            </div>
            <AttendanceChartContainer />
          </div>
        </div>

        {/* FINANCE CHART */}
        <div className="w-full">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Academic Calendar</h2>
            <span className="text-xs text-slate-400 font-medium">Events</span>
          </div>
          <EventCalendarContainer searchParams={searchParams} />
        </div>

        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
