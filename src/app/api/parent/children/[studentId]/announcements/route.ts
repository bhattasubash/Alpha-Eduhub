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

    // Get announcements (school-wide and class-specific, non-expired)
    const announcements = await prisma.announcement.findMany({
      where: {
        schoolId,
        status: "PUBLISHED",
        AND: [
          {
            OR: [
              { classId: null }, // School-wide
              { classId: student.classId }, // Class-specific
            ],
          },
          {
            OR: [
              { expiryDate: null },
              { expiryDate: { gte: new Date() } },
            ],
          },
        ],
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
