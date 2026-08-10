import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

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

    // Get all classes with student counts and pending leave counts
    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        grade: true,
        _count: {
          select: { students: true }
        }
      },
      orderBy: [
        { grade: { level: 'asc' } },
        { name: 'asc' }
      ]
    });

    // Get pending leave requests for each class
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        schoolId,
        studentId: { not: null },
        status: "PENDING"
      },
      include: {
        student: {
          select: {
            classId: true,
            section: true
          }
        }
      }
    });

    // Group pending leaves by class and section
    const pendingLeavesMap = new Map<string, number>();
    
    leaveRequests.forEach(req => {
      if (req.student) {
        const key = `${req.student.classId}-${req.student.section || ''}`;
        pendingLeavesMap.set(key, (pendingLeavesMap.get(key) || 0) + 1);
      }
    });

    // Build response with sections info
    const sectionsInfo = await Promise.all(
      classes.map(async (classInfo) => {
        // Get unique sections for this class
        const students = await prisma.student.findMany({
          where: {
            classId: classInfo.id,
            schoolId
          },
          select: {
            section: true
          },
          distinct: ['section']
        });

        const sections = students.map(s => s.section || null);

        return sections.map(section => {
          const key = `${classInfo.id}-${section || ''}`;
          return {
            classId: classInfo.id,
            className: classInfo.name,
            gradeLevel: classInfo.grade.level,
            section: section,
            studentCount: classInfo._count.students,
            pendingLeaves: pendingLeavesMap.get(key) || 0
          };
        });
      })
    );

    // Flatten the array
    const allSections = sectionsInfo.flat();

    return NextResponse.json(allSections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}