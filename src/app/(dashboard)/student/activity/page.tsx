import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import ActivityTimeline from "@/components/student/ActivityTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

const ActivityPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";

  let attendance: any[] = [];
  let results: any[] = [];
  let assignments: any[] = [];
  let submissions: any[] = [];

  try {
    attendance = await prisma.attendance.findMany({
      where: { studentId: currentUserId },
      orderBy: { date: 'desc' },
      take: 10,
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
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
      take: 10,
    });

    submissions = await prisma.submission.findMany({
      where: { studentId: currentUserId },
      include: {
        assignment: {
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
        submittedAt: 'desc',
      },
      take: 10,
    });
  } catch (error) {
    console.error("Error fetching activity data:", error);
  }

  // Build activity timeline
  const activities = [
    ...attendance.map((a) => ({
      id: `attendance-${a.id}`,
      type: 'attendance' as const,
      title: 'Attendance Marked',
      description: a.present ? 'Present' : 'Absent',
      date: a.date.toISOString(),
      time: new Date(a.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })),
    ...results.map((r) => ({
      id: `result-${r.id}`,
      type: 'exam' as const,
      title: 'Exam Result Published',
      description: `${r.exam.title} - ${r.percentage}%`,
      date: r.exam.startTime.toISOString(),
    })),
    ...submissions.map((s) => ({
      id: `submission-${s.id}`,
      type: 'assignment' as const,
      title: 'Assignment Submitted',
      description: s.assignment?.title || 'Assignment',
      date: s.submittedAt.toISOString(),
    })),
    ...assignments.map((a) => ({
      id: `assignment-${a.id}`,
      type: 'assignment' as const,
      title: 'New Assignment',
      description: a.title,
      date: a.startDate.toISOString(),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Activity</h1>
          <p className="text-slate-600 dark:text-slate-400">View your recent activity and timeline</p>
        </div>

        {activities.length > 0 ? (
          <ActivityTimeline activities={activities} />
        ) : (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <Activity className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No recent activity</h3>
              <p className="text-slate-600 dark:text-slate-400">Your activity will appear here as you engage with the platform.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
