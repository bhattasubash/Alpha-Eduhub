import { NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["PARENT"]);
    const parentId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    // Get parent's children through the junction table
    const parentRelations = await prisma.parentStudent.findMany({
      where: {
        parentId,
        student: {
          schoolId,
        },
      },
      include: {
        student: {
          include: {
            class: true,
            grade: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const children = parentRelations.map((relation) => ({
      id: relation.student.id,
      name: relation.student.name,
      surname: relation.student.surname,
      admissionNumber: relation.student.admissionNumber,
      rollNumber: relation.student.rollNumber,
      img: relation.student.img,
      class: relation.student.class,
      grade: relation.student.grade,
      section: relation.student.section,
      relationshipType: relation.relationshipType,
      isPrimary: relation.isPrimary,
    }));

    return NextResponse.json(children);
  } catch (error) {
    console.error("Error fetching parent children:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
}
