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

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // Format: YYYY-MM

    // Get all attendance records
    const attendances = await prisma.attendance.findMany({
      where: {
        studentId,
        schoolId,
        ...(month && {
          date: {
            gte: new Date(`${month}-01`),
            lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          },
        }),
      },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate statistics
    const presentCount = attendances.filter((a) => a.present).length;
    const absentCount = attendances.filter((a) => !a.present).length;
    const percentage = attendances.length > 0 
      ? Math.round((presentCount / attendances.length) * 100) 
      : 0;

    // Get monthly breakdown
    const monthlyBreakdown: Record<string, { present: number; absent: number; total: number }> = {};
    attendances.forEach((attendance) => {
      const monthKey = attendance.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = { present: 0, absent: 0, total: 0 };
      }
      monthlyBreakdown[monthKey].total++;
      if (attendance.present) {
        monthlyBreakdown[monthKey].present++;
      } else {
        monthlyBreakdown[monthKey].absent++;
      }
    });

    // Get school attendance threshold
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { attendanceThreshold: true },
    });

    const threshold = school?.attendanceThreshold || 75;
    const isBelowThreshold = percentage < threshold;

    return NextResponse.json({
      overall: {
        percentage,
        present: presentCount,
        absent: absentCount,
        total: attendances.length,
        threshold,
        isBelowThreshold,
      },
      monthlyBreakdown: Object.entries(monthlyBreakdown).map(([month, stats]) => ({
        month,
        ...stats,
        percentage: Math.round((stats.present / stats.total) * 100),
      })),
      history: attendances,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
