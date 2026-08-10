import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { triggerTeacherLeaveNotification } from "@/lib/notificationTriggers";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        teacherId,
        ...(schoolId ? { schoolId } : {}),
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
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

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
    const now = new Date();

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

    // Get teacher's assigned classes to notify students
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        classes: {
          include: {
            students: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    if (!schoolId) {
      return NextResponse.json({ error: "School context not found" }, { status: 400 });
    }

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        teacherId,
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

    // Notify ONLY students in teacher's assigned classes
    const assignedClasses = teacher.classes.map(cls => cls.name);
    const studentIds = teacher.classes.flatMap((cls) => cls.students.map((s) => s.id));
    
    console.log(`Teacher ${teacher.name} ${teacher.surname} applying for leave`);
    console.log(`Assigned classes: ${assignedClasses.join(", ")}`);
    console.log(`Notifying ${studentIds.length} students in assigned classes`);
    
    if (studentIds.length > 0) {
      await triggerTeacherLeaveNotification(
        studentIds,
        schoolId ?? "",
        teacherId,
        type,
        start,
        end
      );
    } else {
      console.log("No students to notify - teacher has no assigned classes");
    }

    return NextResponse.json({
      id: leaveRequest.id,
      type: leaveRequest.type,
      startDate: leaveRequest.startDate.toISOString(),
      endDate: leaveRequest.endDate.toISOString(),
      numberOfDays: leaveRequest.numberOfDays,
      reason: leaveRequest.reason,
      status: leaveRequest.status,
      appliedAt: leaveRequest.appliedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    return NextResponse.json(
      { error: "Failed to submit leave request" },
      { status: 500 }
    );
  }
}
