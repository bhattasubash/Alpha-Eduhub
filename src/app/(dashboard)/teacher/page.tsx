import prisma from "@/lib/prisma";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import { Users, BookOpen, Calendar, ClipboardCheck, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';
import StatCard from "@/components/teacher/widgets/StatCard";
import TodayClasses from "@/components/teacher/widgets/TodayClasses";
import PendingTasks from "@/components/teacher/widgets/PendingTasks";
import RecentMessages from "@/components/teacher/widgets/RecentMessages";
import Announcements from "@/components/teacher/widgets/Announcements";
import PerformanceChart from "@/components/teacher/widgets/PerformanceChart";

const TeacherDashboard = async () => {
  await requireSession(["teacher", "TEACHER"]);
  const teacherId = (await getCurrentUserId()) ?? "";

  let teacher: any = null;
  let todayLessons: any[] = [];
  let students: any[] = [];
  let attendanceRecords: any[] = [];
  let pendingHomework = 0;
  let pendingMarks = 0;
  let announcements: any[] = [];

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const dayOfWeek = today.getDay();

  const dayMap: Record<number, string> = {
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
  };
  const dayEnum = dayMap[dayOfWeek];

  try {
    teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        subjects: true,
        classes: true,
      },
    });

    todayLessons = dayEnum
      ? await prisma.lesson.findMany({
          where: {
            teacherId,
            day: dayEnum as any,
            schoolId: teacher?.schoolId,
          },
          include: {
            subject: true,
            class: true,
          },
          orderBy: { startTime: "asc" },
        })
      : [];

    students = await prisma.student.findMany({
      where: {
        class: { lessons: { some: { teacherId } } },
      },
      select: { id: true, name: true, surname: true, classId: true },
    });

    attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: { gte: new Date(todayStr), lt: new Date(todayStr + "T23:59:59") },
        student: { class: { lessons: { some: { teacherId } } } },
      },
    });

    pendingHomework = await prisma.assignment.count({
      where: {
        lesson: { teacherId },
        dueDate: { lte: new Date() },
      },
    });

    pendingMarks = await prisma.exam.count({
      where: {
        lesson: { teacherId },
        startTime: { lte: new Date() },
      },
    });

    announcements = await prisma.announcement.findMany({
      where: {
        schoolId: teacher?.schoolId,
      },
      orderBy: { date: "desc" },
      take: 3,
    });
  } catch (err) {
    console.error("Error loading teacher dashboard:", err);
  }

  const currentTime = today.toTimeString().slice(0, 5);
  const nextClass = todayLessons.find((lesson) => lesson.startTime.toTimeString().slice(0, 5) > currentTime);
  const pendingAttendanceCount = Math.max(0, students.length - attendanceRecords.length);

  // Quick statistics
  const stats = {
    totalStudents: students.length,
    totalClasses: teacher?.classes.length || 0,
    totalSubjects: teacher?.subjects.length || 0,
    todayClasses: todayLessons.length,
  };

  // Mock data for widgets
  const classesData = todayLessons.slice(0, 4).map((lesson, index) => ({
    id: lesson.id,
    subject: lesson.subject.name,
    className: lesson.class.name,
    time: `${lesson.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${lesson.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    room: `Room ${Math.floor(Math.random() * 20) + 100}`,
    students: Math.floor(Math.random() * 30) + 20,
    status: (index === 0 && nextClass?.id === lesson.id ? "ongoing" : index < 2 ? "upcoming" : "completed") as "upcoming" | "ongoing" | "completed",
  }));

  const tasksData = [
    {
      id: "1",
      type: "attendance" as const,
      title: "Mark attendance for today",
      count: pendingAttendanceCount,
      urgent: pendingAttendanceCount > 10,
    },
    {
      id: "2",
      type: "homework" as const,
      title: "Review homework submissions",
      count: pendingHomework,
      urgent: pendingHomework > 5,
    },
    {
      id: "3",
      type: "marks" as const,
      title: "Enter exam marks",
      count: pendingMarks,
      urgent: pendingMarks > 3,
    },
  ];

  const messagesData = [
    {
      id: "1",
      sender: "Sarah Johnson",
      subject: "Question about homework",
      preview: "Hi, I'm having trouble with the math assignment...",
      time: "2h ago",
      unread: true,
    },
    {
      id: "2",
      sender: "Michael Chen",
      subject: "Parent meeting request",
      preview: "Would like to discuss my daughter's progress...",
      time: "5h ago",
      unread: true,
    },
    {
      id: "3",
      sender: "Emily Davis",
      subject: "Absence explanation",
      preview: "Please excuse my absence from yesterday's class...",
      time: "1d ago",
      unread: false,
    },
  ];

  const announcementsData = announcements.slice(0, 3).map((ann) => ({
    id: ann.id,
    title: ann.title,
    content: ann.description || "",
    date: new Date(ann.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    priority: Math.random() > 0.6 ? "high" as const : Math.random() > 0.3 ? "medium" as const : "low" as const,
    author: "School Administration",
  }));

  const performanceData = teacher?.subjects.map((subject: { name: string }) => ({
    subject: subject.name.substring(0, 15),
    average: Math.floor(Math.random() * 20) + 75,
    previous: Math.floor(Math.random() * 20) + 70,
  })) || [];

  return (
    <>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {teacher?.name} {teacher?.surname}
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your classes today.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          trend={{ value: "12%", positive: true }}
        />
        <StatCard
          title="My Classes"
          value={stats.totalClasses}
          icon={BookOpen}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Today's Classes"
          value={stats.todayClasses}
          icon={Calendar}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Pending Attendance"
          value={pendingAttendanceCount}
          icon={ClipboardCheck}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
          trend={{ value: "8%", positive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2">
          <TodayClasses classes={classesData} />
        </div>

        {/* Pending Tasks */}
        <div>
          <PendingTasks tasks={tasksData} />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-1">
          <RecentMessages messages={messagesData} />
        </div>

        {/* Announcements */}
        <div className="lg:col-span-1">
          <Announcements announcements={announcementsData} />
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-1">
          <PerformanceChart data={performanceData} />
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;