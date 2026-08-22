export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { triggerLeaveApprovedNotification, triggerLeaveRejectedNotification } from "@/lib/notificationTriggers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(["teacher", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const userId = session.userId;
    const userRole = session.role;
    const leaveId = params.id;

    const body = await request.json();
    const { action, comment } = body;

    if (!action || !["APPROVE", "REJECT", "CANCEL"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Get the leave request
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: {
        student: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (userRole === "TEACHER" || userRole === "teacher") {
      // Teachers can only approve/reject for their assigned classes ONLY
      const isClassTeacher = leaveRequest.student?.class?.supervisorId === userId;
      
      if (!isClassTeacher) {
        return NextResponse.json(
          { error: "You can only manage leave requests for your assigned class" },
          { status: 403 }
        );
      }
    }

    // Update leave request
    const updatedRequest = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status: action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "CANCELLED",
        reviewedAt: new Date(),
        reviewedBy: userId,
        reviewComment: comment,
      },
    });

    // Trigger notifications
    if (action === "APPROVE" && leaveRequest.studentId) {
      await triggerLeaveApprovedNotification(
        leaveRequest.studentId,
        leaveRequest.schoolId,
        leaveRequest.type
      );
    } else if (action === "REJECT" && leaveRequest.studentId) {
      await triggerLeaveRejectedNotification(
        leaveRequest.studentId,
        leaveRequest.schoolId,
        leaveRequest.type,
        comment
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { error: "Failed to update leave request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;
    const leaveId = params.id;

    // Get the leave request
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    // Students can only cancel their own pending requests
    if (leaveRequest.studentId !== studentId) {
      return NextResponse.json(
        { error: "You can only cancel your own leave requests" },
        { status: 403 }
      );
    }

    if (leaveRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only cancel pending requests" },
        { status: 400 }
      );
    }

    // Update to cancelled
    const updatedRequest = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error cancelling leave request:", error);
    return NextResponse.json(
      { error: "Failed to cancel leave request" },
      { status: 500 }
    );
  }
}
