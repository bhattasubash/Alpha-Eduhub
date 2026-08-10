import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import ExamPerformanceCard from "@/components/student/ExamPerformanceCard";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

const ExamsPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";
  let exams: any[] = [];

  try {
    exams = await prisma.exam.findMany({
      where: {
        endTime: { gte: new Date() },
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
    });
  } catch (error) {
    console.error("Error fetching exam data:", error);
  }

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Exams</h1>
          <p className="text-slate-600 dark:text-slate-400">View your exam results and performance history</p>
        </div>

        {examData.length > 0 ? (
          <div className="space-y-4">
            {examData.map((exam) => (
              <ExamPerformanceCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No exam results yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Results will appear here once examinations have been published.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
