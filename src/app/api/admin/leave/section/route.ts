import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

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
    const classId = searchParams.get("classId");
    const section = searchParams.get("section");
    const status = searchParams.get("status");

    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: any = {
      schoolId,
      studentId: { not: null },
      student: {
        classId: parseInt(classId)
      }
    };

    // Add section filter if provided
    if (section !== null && section !== undefined && section !== "") {
      whereClause.student.section = section;
    } else {
      whereClause.student.section = null;
    }

    // Add status filter if provided
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            class: true,
            grade: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    // Add type field to each request
    const requestsWithType = leaveRequests.map(req => ({
      ...req,
      type: "STUDENT"
    }));

    return NextResponse.json(requestsWithType);
  } catch (error) {
    console.error("Error fetching section leave requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}