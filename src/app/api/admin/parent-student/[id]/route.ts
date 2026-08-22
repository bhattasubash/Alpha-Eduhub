export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession(["SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = session.schoolId;
    const userRole = session.role;
    const relationshipId = params.id;

    // Get the relationship
    const relationship = await prisma.parentStudent.findUnique({
      where: { id: relationshipId },
      include: {
        student: true,
      },
    });

    if (!relationship) {
      return NextResponse.json(
        { error: "Relationship not found" },
        { status: 404 }
      );
    }

    // Validate school relationship
    if (userRole !== "SUPER_ADMIN") {
      if (relationship.student.schoolId !== schoolId) {
        return NextResponse.json(
          { error: "Unauthorized: School mismatch" },
          { status: 403 }
        );
      }
    }

    // Delete the relationship
    await prisma.parentStudent.delete({
      where: { id: relationshipId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting parent-student relationship:", error);
    return NextResponse.json(
      { error: "Failed to delete relationship" },
      { status: 500 }
    );
  }
}
