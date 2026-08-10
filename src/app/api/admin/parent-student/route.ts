import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = session.schoolId;
    const userRole = session.role;

    if (!schoolId && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const studentId = searchParams.get("studentId");

    // Get parent-student relationships
    const where: any = {};
    
    if (schoolId) {
      where.student = {
        schoolId,
      };
    }

    if (parentId) {
      where.parentId = parentId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    const relationships = await prisma.parentStudent.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        student: {
          include: {
            class: true,
            grade: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(relationships);
  } catch (error) {
    console.error("Error fetching parent-student relationships:", error);
    return NextResponse.json(
      { error: "Failed to fetch relationships" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = session.schoolId;
    const userRole = session.role;

    if (!schoolId && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { parentId, studentId, relationshipType, isPrimary } = body;

    if (!parentId || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields: parentId and studentId" },
        { status: 400 }
      );
    }

    // Validate parent exists
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      );
    }

    // Validate student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Validate school relationship
    if (userRole !== "SUPER_ADMIN") {
      if (parent.schoolId !== schoolId || student.schoolId !== schoolId) {
        return NextResponse.json(
          { error: "Parent and student must belong to the same school" },
          { status: 403 }
        );
      }
    } else {
      // Super admin can link across schools, but validate both exist
      if (parent.schoolId !== student.schoolId) {
        return NextResponse.json(
          { error: "Cross-school linking requires both to be in same school" },
          { status: 403 }
        );
      }
    }

    // Check if relationship already exists
    const existing = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Relationship already exists" },
        { status: 400 }
      );
    }

    // If setting as primary, remove primary status from other relationships
    if (isPrimary) {
      await prisma.parentStudent.updateMany({
        where: {
          studentId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create relationship
    const relationship = await prisma.parentStudent.create({
      data: {
        parentId,
        studentId,
        relationshipType: relationshipType || "GUARDIAN",
        isPrimary: isPrimary || false,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        student: {
          include: {
            class: true,
            grade: true,
          },
        },
      },
    });

    return NextResponse.json(relationship, { status: 201 });
  } catch (error) {
    console.error("Error creating parent-student relationship:", error);
    return NextResponse.json(
      { error: "Failed to create relationship" },
      { status: 500 }
    );
  }
}
