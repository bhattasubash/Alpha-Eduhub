import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { LeaveStatus } from "@prisma/client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    
    // Get schoolId from session or active context
    let schoolId = session.schoolId;
    
    // Handle Super Admin with context switching
    if ((session.role === "SUPER_ADMIN" || session.role === "provider") && !schoolId) {
      const { searchParams: sp } = new URL(request.url);
      schoolId = sp.get("schoolId") ?? null;
    }
    
    if (!schoolId) {
      return NextResponse.json(
        { error: "School context required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as LeaveStatus | null;
    const type = searchParams.get("type");

    const studentLeaveRequests: Awaited<ReturnType<typeof prisma.leaveRequest.findMany>> = [];
    const teacherLeaveRequests: Awaited<ReturnType<typeof prisma.leaveRequest.findMany>> = [];

    // Fetch student leave requests
    if (!type || type === "ALL" || type === "STUDENT") {
      const rows = await prisma.leaveRequest.findMany({
        where: {
          schoolId,
          studentId: { not: null },
          ...(status ? { status } : {}),
        },
        include: {
          student: { include: { class: true, grade: true } },
        },
        orderBy: { appliedAt: "desc" },
      });
      studentLeaveRequests.push(...rows);
    }

    // Fetch teacher leave requests
    if (!type || type === "ALL" || type === "TEACHER") {
      const rows = await prisma.leaveRequest.findMany({
        where: {
          schoolId,
          teacherId: { not: null },
          ...(status ? { status } : {}),
        },
        include: { teacher: true },
        orderBy: { appliedAt: "desc" },
      });
      teacherLeaveRequests.push(...rows);
    }

    // Combine and return all requests
    const allRequests = [
      ...studentLeaveRequests.map(req => ({ ...req, type: "STUDENT" })),
      ...teacherLeaveRequests.map(req => ({ ...req, type: "TEACHER" })),
    ].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    return NextResponse.json(allRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}
