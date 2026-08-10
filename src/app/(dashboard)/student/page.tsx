import prisma from "@/lib/prisma";
import { getCurrentUserId, getSession } from "@/lib/getRole";
import { checkStudentAccess, filterStudentData } from "@/lib/studentAccess";
import ProfileHero from "@/components/student/ProfileHero";
import ProfileSummary from "@/components/student/ProfileSummary";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import AttendanceWithThreshold from "@/components/student/AttendanceWithThreshold";
import ExamPerformanceCard from "@/components/student/ExamPerformanceCard";
import AssignmentCard from "@/components/student/AssignmentCard";
import BehaviourTimeline from "@/components/student/BehaviourTimeline";
import ParentCard from "@/components/student/ParentCard";
import DocumentCard from "@/components/student/DocumentCard";
import ActivityTimeline from "@/components/student/ActivityTimeline";
import LeaveHistory from "@/components/student/LeaveHistory";
import GoalsTracker from "@/components/student/GoalsTracker";
import AchievementSystem from "@/components/student/AchievementSystem";
import ProfileHeroSkeleton from "@/components/student/ProfileHeroSkeleton";
import ProfileSummarySkeleton from "@/components/student/ProfileSummarySkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, FileText, Users, FolderOpen, Send } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const StudentPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";
  const session = await getSession();

  // Check access control (commented out for development - uncomment in production)
  // const access = await checkStudentAccess(currentUserId);
  // if (!access.hasAccess) {
  //   redirect("/unauthorized");
  // }

  /* ── fetch student data ── */
  let student: {
    name: string;
    surname: string;
    username: string;
    img?: string | null;
    admissionNumber?: string | null;
    rollNumber?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string;
    class: { name: string } | null;
    grade: { level: number } | null;
    section?: string | null;
    parent: {
      name: string;
      surname: string;
      email?: string | null;
      phone?: string | null;
      img?: string | null;
    } | null;
    school: {
      academicYear?: string | null;
      attendanceThreshold?: number | null;
    } | null;
  } | null = null;

  let attendanceData: any[] = [];
  let results: any[] = [];
  let assignments: any[] = [];
  let exams: any[] = [];
  let disciplines: any[] = [];
  let leaveRequests: any[] = [];
  let achievements: any[] = [];
  let goals: any[] = [];

  try {
    student = await prisma.student.findUnique({
      where: { id: currentUserId },
      include: {
        class: true,
        grade: true,
        parent: true,
        school: {
          select: {
            academicYear: true,
            // attendanceThreshold: true, // Temporarily commented until Prisma regenerate
          },
        },
      },
    });

    // Check for new achievements (temporarily disabled)
    // if (student?.schoolId) {
    //   try {
    //     const { checkAndAwardAchievements } = await import("@/lib/achievementSystem");
    //     await checkAndAwardAchievements(currentUserId, student.schoolId);
    //   } catch (error) {
    //     console.error("Error checking achievements:", error);
    //   }
    // }

    attendanceData = await prisma.attendance.findMany({
      where: {
        studentId: currentUserId,
        date: {
          gte: new Date(new Date().getFullYear(), 0, 1),
        },
      },
    });

    results = await prisma.result.findMany({
      where: { studentId: currentUserId },
      include: {
        exam: {
          include: {
            lesson: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: {
        exam: {
          startTime: 'desc',
        },
      },
      take: 10,
    });

    assignments = await prisma.assignment.findMany({
      where: {
        lesson: {
          class: {
            students: {
              some: { id: currentUserId },
            },
          },
        },
      },
      include: {
        lesson: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: 5,
    });

    exams = await prisma.exam.findMany({
      where: {
        lesson: {
          class: {
            students: {
              some: { id: currentUserId },
            },
          },
        },
      },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
        results: {
          where: { studentId: currentUserId },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 5,
    });

    disciplines = await prisma.discipline.findMany({
      where: { studentId: currentUserId },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    leaveRequests = await prisma.leaveRequest.findMany({
      where: { studentId: currentUserId },
      orderBy: {
        appliedAt: 'desc',
      },
      take: 5,
    });

    achievements = await prisma.studentAchievement.findMany({
      where: { studentId: currentUserId },
      orderBy: {
        achievedAt: 'desc',
      },
      take: 6,
    });

    goals = await prisma.studentGoal.findMany({
      where: { studentId: currentUserId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Re-fetch achievements after checking
    achievements = await prisma.studentAchievement.findMany({
      where: { studentId: currentUserId },
      orderBy: {
        achievedAt: 'desc',
      },
      take: 6,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
  }

  // Calculate attendance metrics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter((day) => day.present).length;
  const absentDays = attendanceData.filter((day) => !day.present).length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  const attendanceThreshold = 75;

  // Calculate academic metrics
  const overallPercentage = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
    : 0;

  const averageMarks = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.marks || 0), 0) / results.length)
    : 0;

  const grade = results.length > 0
    ? (overallPercentage >= 90 ? 'A' : overallPercentage >= 80 ? 'B' : overallPercentage >= 70 ? 'C' : overallPercentage >= 60 ? 'D' : 'F')
    : 'N/A';

  const totalAssignmentsCount = assignments.length;
  const completedAssignmentsCount = assignments.filter((a) => (a as any).submissions && (a as any).submissions.length > 0).length;
  const pendingAssignmentsCount = Math.max(0, totalAssignmentsCount - completedAssignmentsCount);



  // Prepare exam data
  const examData = exams.map((exam) => {
    const studentResult = exam.results[0];
    return {
      id: exam.id,
      title: exam.title,
      date: exam.startTime.toISOString(),
      overallPercentage: studentResult?.percentage || 0,
      overallGrade: studentResult?.grade || 'N/A',
      results: [
        {
          subject: exam.lesson?.subject?.name || 'Subject',
          marks: studentResult?.marks || 0,
          maxMarks: exam.maxMarks,
          grade: studentResult?.grade || 'N/A',
          percentage: studentResult?.percentage || 0,
          remarks: studentResult?.remarks || '',
        },
      ],
    };
  });

  // Prepare assignment data
  const assignmentData = assignments.map((assignment) => {
    const isOverdue = new Date(assignment.dueDate) < new Date();
    return {
      id: assignment.id,
      title: assignment.title,
      subject: assignment.lesson?.subject?.name || 'Subject',
      teacher: assignment.lesson?.teacher?.name || 'Teacher',
      dueDate: assignment.dueDate.toISOString(),
      status: (isOverdue ? 'overdue' : 'upcoming') as "pending" | "submitted" | "overdue" | "completed" | "upcoming",
      progress: 0,
    };
  });

  // Prepare behaviour data
  const behaviourData = disciplines.map((discipline) => ({
    id: discipline.id,
    type: (discipline.type === 'POSITIVE' ? 'positive' : 'discipline') as "discipline" | "positive" | "achievement" | "observation",
    title: discipline.type === 'POSITIVE' ? 'Positive Behaviour' : 'Discipline Record',
    description: discipline.description || '',
    date: discipline.date.toISOString(),
    teacher: discipline.givenBy,
  }));

  // Prepare activity data
  const activityData = [
    ...(assignments.slice(0, 3).map((a) => ({
      id: `assignment-${a.id}`,
      type: 'assignment' as const,
      title: 'Assignment Available',
      description: `${a.title} - ${a.lesson?.subject?.name}`,
      date: a.startDate.toISOString(),
    }))),
    ...(results.slice(0, 2).map((r) => ({
      id: `result-${r.id}`,
      type: 'exam' as const,
      title: 'Exam Result Published',
      description: `${r.exam.title} - ${r.percentage}%`,
      date: r.exam.startTime.toISOString(),
    }))),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  if (!student) {
    return (
      <div className="p-6">
        <ProfileHeroSkeleton />
        <ProfileSummarySkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Profile Hero */}
        <ProfileHero student={student} school={student.school} />

        {/* Profile Summary */}
        <ProfileSummary
          attendance={{
            percentage: attendancePercentage,
            present: presentDays,
            absent: absentDays,
            late: 0,
            total: totalDays,
          }}
          academics={{
            overallPercentage,
            averageMarks,
            grade,
          }}
          assignments={{
            completed: completedAssignmentsCount,
            total: totalAssignmentsCount,
            pending: pendingAssignmentsCount,
          }}
        />

        {/* Overview Dashboard - Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Academic Performance Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Academic Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{overallPercentage}%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Overall</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{averageMarks}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Avg. Marks</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{grade}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Grade</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/student/academics" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View detailed academic performance →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Exams */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Recent Exams</h2>
              <Link href="/student/exams" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {examData.length > 0 ? (
                examData.map((exam) => (
                  <ExamPerformanceCard key={exam.id} exam={exam} />
                ))
              ) : (
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">No exam results yet</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Assignments */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Upcoming Assignments</h2>
              <Link href="/student/assignments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {assignmentData.length > 0 ? (
                assignmentData.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              ) : (
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">No upcoming assignments</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Smaller widgets */}
          <div className="space-y-6">
            {/* Attendance with Threshold */}
            <AttendanceWithThreshold
              percentage={attendancePercentage}
              present={presentDays}
              absent={absentDays}
              total={totalDays}
              threshold={attendanceThreshold}
              upcomingClasses={20}
            />

            {/* Parent Information */}
            {student.parent && (
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Parent/Guardian</h2>
                <Link href="/student/parents" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </Link>
              </div>
            )}
            {student.parent && (
              <ParentCard
                parent={{
                  ...student.parent,
                  relationship: "Parent",
                  accountStatus: "active",
                }}
              />
            )}

            {/* Recent Activity */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Recent Activity</h2>
              <Link href="/student/activity" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </Link>
            </div>
            <ActivityTimeline activities={activityData} />
          </div>
        </div>

        {/* Behaviour & Achievements */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Behaviour & Achievements</h2>
          <Link href="/student/behaviour" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        <BehaviourTimeline items={behaviourData} />

        {/* Goals & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalsTracker goals={goals} />
          <AchievementSystem achievements={achievements} />
        </div>

        {/* Leave History */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Leave History</h2>
          <Link href="/student/leave" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        <LeaveHistory leaveRequests={leaveRequests} />
      </div>
    </div>
  );
};

export default StudentPage;
