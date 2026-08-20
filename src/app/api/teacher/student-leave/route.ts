import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;
    const userRole = session.role;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let leaveRequests;

    if (userRole === "TEACHER" || userRole === "teacher") {
      // Teachers can see leave requests for their assigned classes ONLY
      const teacherClasses = await prisma.class.findMany({
        where: {
          supervisorId: teacherId,
        },
        select: { id: true, name: true },
      });

      const classIds = teacherClasses.map((c) => c.id);
      const classNames = teacherClasses.map((c) => c.name);

      console.log(`Teacher ${teacherId} fetching leave requests for assigned classes: ${classNames.join(", ")}`);

      leaveRequests = await prisma.leaveRequest.findMany({
        where: {
          ...(schoolId ? { schoolId } : {}),
          student: {
            classId: { in: classIds },
          },
          ...(status ? { status: status as import("@prisma/client").LeaveStatus } : {}),
        },
        include: {
          student: {
            include: { class: true, grade: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });
    } else {
      // Admins can see all leave requests for their school
      leaveRequests = await prisma.leaveRequest.findMany({
        where: {
          ...(schoolId ? { schoolId } : {}),
          ...(status ? { status: status as import("@prisma/client").LeaveStatus } : {}),
        },
        include: {
          student: {
            include: { class: true, grade: true },
          },
        },
        orderBy: { appliedAt: "desc" },
      });
    }

    return NextResponse.json(leaveRequests);
  } catch (error) {
    console.error("Error fetching student leave requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}
