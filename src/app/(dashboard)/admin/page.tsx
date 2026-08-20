import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { guardSchoolAdmin } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { Ticket, CalendarDays, DollarSign, ArrowRight, GraduationCap, Users, CalendarCheck } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to prevent static generation issues
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

  // Placeholders until migration is run
  const collectedFees = 0;
  const pendingDues = 0;

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">

        {/* TOP ROW: USERS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="admin" />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* TIMETABLE CARD */}
            <Link href="/admin/timetable" className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <CalendarDays className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 text-lg">Timetable</h3>
                <p className="text-sm text-gray-500 mt-1">View &amp; manage weekly class schedules</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">{totalClasses} Classes</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                  <span key={d} className="flex-1 text-center text-[10px] font-bold text-indigo-600 bg-indigo-50 py-1 rounded-lg">{d}</span>
                ))}
              </div>
            </Link>

            {/* FEES CARD */}
            <Link href="/admin/fees" className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <DollarSign className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 text-lg">Fee Management</h3>
                <p className="text-sm text-gray-500 mt-1">Assign &amp; track fees class-wise</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">{totalStudents} Students</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-emerald-700">₹{collectedFees.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600">Collected</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-bold text-red-600">₹{pendingDues.toLocaleString()}</p>
                  <p className="text-[10px] text-red-500">Pending</p>
                </div>
              </div>
            </Link>

            {/* LEAVE MANAGEMENT CARD */}
            <Link href="/admin/leave" className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <CalendarCheck className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 text-lg">Leave Management</h3>
                <p className="text-sm text-gray-500 mt-1">Approve student &amp; teacher leave requests</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">{totalStudents + totalTeachers} Staff</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-bold text-blue-700">Students</p>
                </div>
                <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-bold text-purple-700">Teachers</p>
                </div>
              </div>
            </Link>

            {/* BULK STUDENT IMPORT CARD */}
            <Link href="/admin/students/bulk" className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-green-200 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <Users className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 text-lg">Bulk Student Import</h3>
                <p className="text-sm text-gray-500 mt-1">Import hundreds of students at once</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">Excel Import</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-bold text-green-700">Auto Login</p>
                </div>
                <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] font-bold text-emerald-700">Parent Link</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Ticket className="w-6 h-6 text-amber-500 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">{openTickets}</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Open Tickets</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <GraduationCap className="w-6 h-6 text-blue-500 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">{totalClasses}</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Classes</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
            <Users className="w-6 h-6 text-purple-500 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">{totalTeachers}</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Teachers</p>
          </div>
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">

        {/* DATABASE MIGRATION NOTICE */}
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
          <h2 className="text-sm font-bold text-amber-800 mb-2">⚠️ Run Database Migration</h2>
          <p className="text-xs text-amber-700 leading-relaxed">
            Fee collection &amp; Feature Flags need a one-time migration:
          </p>
          <div className="mt-3 bg-amber-100 rounded-lg p-3 font-mono text-xs text-amber-900 space-y-1">
            <div>npx prisma generate</div>
            <div>npx prisma migrate dev --name enterprise_v1</div>
          </div>
        </div>

        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
