import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await requireSession(["PARENT"]);
    const parentId = session.userId;
    const schoolId = session.schoolId;
    const { studentId } = params;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    // Verify parent-child relationship
    const parentRelation = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (!parentRelation) {
      return NextResponse.json(
        { error: "Unauthorized: Child not linked to this parent" },
        { status: 403 }
      );
    }

    // Get all results for the student
    const results = await prisma.result.findMany({
      where: {
        studentId,
        schoolId,
      },
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
        id: "desc",
      },
    });

    // Group by subject
    const subjectResults: Record<string, any[]> = {};
    results.forEach((result) => {
      const subject = result.exam?.lesson?.subject?.name || 
                     result.assignment?.lesson?.subject?.name || 
                     "General";
      if (!subjectResults[subject]) {
        subjectResults[subject] = [];
      }
      subjectResults[subject].push(result);
    });

    // Calculate subject-wise averages
    const subjectPerformance = Object.entries(subjectResults).map(([subject, subjectResults]) => {
      const totalPercentage = subjectResults.reduce((sum: number, r: any) => sum + (r.percentage || 0), 0);
      const average = Math.round(totalPercentage / subjectResults.length);
      const highest = Math.max(...subjectResults.map((r: any) => r.percentage || 0));
      const lowest = Math.min(...subjectResults.map((r: any) => r.percentage || 0));

      return {
        subject,
        average,
        highest,
        lowest,
        resultsCount: subjectResults.length,
        results: subjectResults,
      };
    });

    // Calculate overall performance
    const overallPercentage = results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
        )
      : 0;

    // Find personal best
    const personalBest = results.length > 0
      ? results.reduce((best, current) => 
          (current.percentage || 0) > (best.percentage || 0) ? current : best
        )
      : null;

    // Calculate trend (last 5 results)
    const recentResults = results.slice(0, 5);
    let trend = "STABLE";
    if (recentResults.length > 1) {
      const first = recentResults[0];
      const last = recentResults[recentResults.length - 1];
      if (first && last && first.percentage !== null && last.percentage !== null) {
        if (first.percentage > last.percentage) {
          trend = "IMPROVING";
        } else if (first.percentage < last.percentage) {
          trend = "DECLINING";
        }
      }
    }

    return NextResponse.json({
      overall: {
        percentage: overallPercentage,
        resultsCount: results.length,
        trend,
        personalBest: personalBest ? {
          percentage: personalBest.percentage,
          title: personalBest.exam?.title || personalBest.assignment?.title,
          date: personalBest.submittedAt || personalBest.exam?.startTime,
        } : null,
      },
      subjects: subjectPerformance,
      allResults: results,
    });
  } catch (error) {
    console.error("Error fetching academic performance:", error);
    return NextResponse.json(
      { error: "Failed to fetch academic performance" },
      { status: 500 }
    );
  }
}
