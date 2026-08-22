export const dynamic = "force-dynamic";

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
    const status = searchParams.get("status"); // pending, submitted, graded

    // Get student's class
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classId: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Get assignments for student's class
    const assignments = await prisma.assignment.findMany({
      where: {
        schoolId,
        lesson: {
          classId: student.classId,
        },
      },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
        submissions: {
          where: {
            studentId,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    // Categorize assignments
    const pending = assignments.filter((a) => 
      a.dueDate >= new Date() && !a.submissions.some((s) => s.studentId === studentId)
    );
    
    const submitted = assignments.filter((a) => 
      a.submissions.some((s) => s.studentId === studentId)
    );
    
    const overdue = assignments.filter((a) => 
      a.dueDate < new Date() && !a.submissions.some((s) => s.studentId === studentId)
    );

    // Format response based on status filter
    let filteredAssignments = assignments;
    if (status === "pending") {
      filteredAssignments = pending;
    } else if (status === "submitted") {
      filteredAssignments = submitted;
    } else if (status === "overdue") {
      filteredAssignments = overdue;
    }

    return NextResponse.json({
      all: assignments,
      pending,
      submitted,
      overdue,
      filtered: filteredAssignments,
      counts: {
        total: assignments.length,
        pending: pending.length,
        submitted: submitted.length,
        overdue: overdue.length,
      },
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
