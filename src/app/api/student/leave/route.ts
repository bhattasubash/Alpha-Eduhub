import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { triggerLeaveSubmittedNotification } from "@/lib/notificationTriggers";

export async function GET() {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        studentId,
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    return NextResponse.json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, startDate, endDate, reason, attachmentUrl } = body;

    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Calculate number of days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Get student's class to find class teacher
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            supervisor: true,
          },
        },
      },
    });

    if (!student || !student.class) {
      return NextResponse.json(
        { error: "Student class information not found" },
        { status: 404 }
      );
    }

    // Get class teacher ID for routing
    const classTeacherId = student.class.supervisorId;

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        studentId,
        type,
        startDate: start,
        endDate: end,
        numberOfDays,
        reason,
        attachmentUrl,
        status: "PENDING",
        schoolId,
      },
    });

    // Trigger notification for class teacher
    await triggerLeaveSubmittedNotification(studentId, schoolId, type, start, end);

    return NextResponse.json({
      id: leaveRequest.id,
      type: leaveRequest.type,
      startDate: leaveRequest.startDate.toISOString(),
      endDate: leaveRequest.endDate.toISOString(),
      numberOfDays: leaveRequest.numberOfDays,
      reason: leaveRequest.reason,
      status: leaveRequest.status,
      appliedAt: leaveRequest.appliedAt.toISOString(),
      classTeacherId,
    });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    return NextResponse.json(
      { error: "Failed to submit leave request" },
      { status: 500 }
    );
  }
}
