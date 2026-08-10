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
      include: {
        student: {
          include: {
            class: true,
            grade: true,
          },
        },
      },
    });

    if (!parentRelation) {
      return NextResponse.json(
        { error: "Unauthorized: Child not linked to this parent" },
        { status: 403 }
      );
    }

    // Verify school relationship
    if (parentRelation.student.schoolId !== schoolId) {
      return NextResponse.json(
        { error: "Unauthorized: School mismatch" },
        { status: 403 }
      );
    }

    // Calculate attendance percentage
    const attendances = await prisma.attendance.findMany({
      where: {
        studentId,
      },
    });

    const presentCount = attendances.filter((a) => a.present).length;
    const attendancePercentage = attendances.length > 0 
      ? Math.round((presentCount / attendances.length) * 100) 
      : 0;

    // Get results/marks
    const results = await prisma.result.findMany({
      where: {
        studentId,
      },
      include: {
        exam: true,
        assignment: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    // Calculate overall percentage
    const overallPercentage = results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
        )
      : 0;

    // Get pending assignments
    const submissions = await prisma.submission.findMany({
      where: {
        studentId,
      },
      include: {
        assignment: true,
      },
    });

    const pendingAssignments = await prisma.assignment.findMany({
      where: {
        lesson: {
          class: {
            students: {
              some: {
                id: studentId,
              },
            },
          },
        },
        dueDate: {
          gte: new Date(),
        },
        NOT: {
          submissions: {
            some: {
              studentId,
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
    });

    // Get upcoming exams
    const upcomingExams = await prisma.exam.findMany({
      where: {
        lesson: {
          class: {
            students: {
              some: {
                id: studentId,
              },
            },
          },
        },
        startTime: {
          gte: new Date(),
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
        startTime: "asc",
      },
    });

    // Get fee status
    const studentFees = await prisma.studentFee.findMany({
      where: {
        studentId,
      },
      include: {
        feeStructure: true,
      },
    });

    const totalFee = studentFees.reduce((sum, fee) => sum + Number(fee.totalAmount), 0);
    const paidAmount = studentFees.reduce((sum, fee) => sum + Number(fee.amountPaid), 0);
    const pendingAmount = totalFee - paidAmount;

    return NextResponse.json({
      student: parentRelation.student,
      relationshipType: parentRelation.relationshipType,
      isPrimary: parentRelation.isPrimary,
      attendance: {
        percentage: attendancePercentage,
        present: presentCount,
        total: attendances.length,
      },
      academics: {
        overallPercentage,
        resultsCount: results.length,
        results,
      },
      assignments: {
        pending: pendingAssignments.length,
        pendingAssignments,
        submissionsCount: submissions.length,
      },
      exams: {
        upcoming: upcomingExams.length,
        upcomingExams,
      },
      fees: {
        total: totalFee,
        paid: paidAmount,
        pending: pendingAmount,
        status: pendingAmount === 0 ? "PAID" : "PENDING",
      },
    });
  } catch (error) {
    console.error("Error fetching child details:", error);
    return NextResponse.json(
      { error: "Failed to fetch child details" },
      { status: 500 }
    );
  }
}
