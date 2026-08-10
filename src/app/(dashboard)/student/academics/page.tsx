import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/getRole";
import ProfileNavigation from "@/components/student/ProfileNavigation";
import EnhancedAcademicPerformance from "@/components/student/EnhancedAcademicPerformance";

export const dynamic = 'force-dynamic';

const AcademicsPage = async () => {
  const currentUserId = (await getCurrentUserId()) ?? "unknown";

  let results: any[] = [];
  let student: any = null;

  try {
    student = await prisma.student.findUnique({
      where: { id: currentUserId },
      include: {
        class: true,
        grade: true,
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
    });
  } catch (error) {
    console.error("Error fetching academic data:", error);
  }

  // Calculate metrics
  const overallPercentage = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
    : 0;

  const averageMarks = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.marks || 0), 0) / results.length)
    : 0;

  const grade = overallPercentage >= 90 ? 'A' : overallPercentage >= 80 ? 'B' : overallPercentage >= 70 ? 'C' : overallPercentage >= 60 ? 'D' : 'F';

  // Group by subject
  const subjectPerformance = results.reduce((acc, result) => {
    const subject = result.exam.lesson?.subject?.name || 'Unknown';
    if (!acc[subject]) {
      acc[subject] = { total: 0, count: 0, maxTotal: 0 };
    }
    acc[subject].total += result.marks || 0;
    acc[subject].maxTotal += result.exam.maxMarks;
    acc[subject].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; maxTotal: number }>);

  const subjectData = Object.entries(subjectPerformance).map(([subject, subjectStats]) => {
    const stats = subjectStats as { total: number; count: number; maxTotal: number };
    const avg = stats.maxTotal > 0 ? Math.round((stats.total / stats.maxTotal) * 100) : 0;
    return {
      subject,
      percentage: avg,
      average: Math.round(stats.total / stats.count),
      grade: avg >= 90 ? 'A' : avg >= 80 ? 'B' : avg >= 70 ? 'C' : avg >= 60 ? 'D' : 'F',
    };
  });

  // Prepare chart data
  const performanceData = results.map((result) => ({
    date: new Date(result.exam.startTime).toLocaleDateString(),
    examName: result.exam.title,
    percentage: result.percentage || 0,
  }));

  // Prepare exam results
  const examResults = results.map((result) => ({
    id: result.id,
    title: result.exam.title,
    date: result.exam.startTime.toISOString(),
    percentage: result.percentage || 0,
    grade: result.grade || 'N/A',
    marks: result.marks || 0,
    maxMarks: result.exam.maxMarks,
  }));

  // Find personal best
  const personalBest = results.length > 0
    ? results.reduce((best, current) => 
        (current.percentage || 0) > (best.percentage || 0) ? current : best
      )
    : null;

  const personalBestData = personalBest
    ? {
        percentage: personalBest.percentage || 0,
        exam: personalBest.exam.title,
        date: personalBest.exam.startTime.toISOString(),
      }
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Academic Performance</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your academic progress and subject-wise performance</p>
        </div>

        <EnhancedAcademicPerformance
          overallPercentage={overallPercentage}
          averageMarks={averageMarks}
          grade={grade}
          subjectPerformance={subjectData}
          performanceData={performanceData}
          examResults={examResults}
          personalBest={personalBestData}
        />
      </div>
    </div>
  );
};

export default AcademicsPage;
