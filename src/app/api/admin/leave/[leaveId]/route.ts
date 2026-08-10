import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { leaveId: string } }
) {
  try {
    const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = session.schoolId;
    
    if (!schoolId) {
      return NextResponse.json(
        { error: "School context required" },
        { status: 400 }
      );
    }
    
    const { leaveId } = params;

    const body = await request.json();
    const { action, comment } = body;

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or REJECT" },
        { status: 400 }
      );
    }

    // Check if leave request exists and belongs to the school
    const leaveRequest = await prisma.leaveRequest.findFirst({
      where: {
        id: leaveId,
        schoolId
      }
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    // Update leave request
    const updatedRequest = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status: action === "APPROVE" ? "APPROVED" : "REJECTED",
        reviewedAt: new Date(),
        reviewedBy: session.username,
        reviewComment: comment || null
      },
      include: {
        student: {
          include: {
            class: true,
            grade: true,
          },
        },
        teacher: true,
      }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { error: "Failed to update leave request" },
      { status: 500 }
    );
  }
}