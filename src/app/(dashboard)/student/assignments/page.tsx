import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import AssignmentCard from "@/components/student/AssignmentCard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

const AssignmentsPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";
  let assignments: any[] = [];
  let submissions: any[] = [];

  try {
    assignments = await prisma.assignment.findMany({
      where: {
        dueDate: { gte: new Date() },
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
    });

    submissions = await prisma.submission.findMany({
      where: { studentId: currentUserId },
    });
  } catch (error) {
    console.error("Error fetching assignment data:", error);
  }

  const submissionMap = new Map(submissions.map((s) => [s.assignmentId, s]));

  const assignmentData = assignments.map((assignment) => {
    const submission = submissionMap.get(assignment.id);
    const isOverdue = new Date(assignment.dueDate) < new Date() && !submission;
    
    let status: "upcoming" | "pending" | "submitted" | "completed" | "overdue" = "upcoming";
    if (submission) {
      status = submission.grade ? "completed" : "submitted";
    } else if (isOverdue) {
      status = "overdue";
    } else if (new Date(assignment.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) {
      status = "pending";
    }

    return {
      id: assignment.id,
      title: assignment.title,
      subject: assignment.lesson?.subject?.name || 'Subject',
      teacher: assignment.lesson?.teacher?.name || 'Teacher',
      dueDate: assignment.dueDate.toISOString(),
      status,
      progress: submission ? 100 : 0,
    };
  });

  // Group by status
  const upcoming = assignmentData.filter((a) => a.status === "upcoming");
  const pending = assignmentData.filter((a) => a.status === "pending" || a.status === "overdue");
  const submitted = assignmentData.filter((a) => a.status === "submitted");
  const completed = assignmentData.filter((a) => a.status === "completed");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Assignments</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your assignments</p>
        </div>

        {assignmentData.length > 0 ? (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              </div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Pending</h2>
                <div className="space-y-3">
                  {pending.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              </div>
            )}

            {/* Submitted */}
            {submitted.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Submitted</h2>
                <div className="space-y-3">
                  {submitted.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Completed</h2>
                <div className="space-y-3">
                  {completed.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No assignments yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Assignments will appear here once teachers create them.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
