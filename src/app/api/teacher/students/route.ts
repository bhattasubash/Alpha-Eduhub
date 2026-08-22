import { NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const students = await prisma.student.findMany({
      where: {
        ...(session.schoolId ? { schoolId: session.schoolId } : {}),
        class: {
          lessons: {
            some: {
              teacherId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodType: true,
        sex: true,
        birthday: true,
        admissionNumber: true,
        rollNumber: true,
        section: true,
        classId: true,
        class: {
          select: {
            name: true,
            grade: {
              select: {
                level: true,
              },
            },
          },
        },
        parent: {
          select: {
            name: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            attendances: true,
            results: true,
            disciplines: true,
          },
        },
      },
      orderBy: [
        { class: { name: "asc" } },
        { name: "asc" },
        { surname: "asc" },
      ],
    });

    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.name,
      surname: student.surname,
      email: student.email,
      phone: student.phone,
      address: student.address,
      img: student.img,
      bloodType: student.bloodType,
      sex: student.sex,
      birthday: student.birthday.toISOString(),
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      section: student.section,
      classId: student.classId,
      className: student.class.name,
      gradeLevel: student.class.grade.level,
      parentName: student.parent ? `${student.parent.name} ${student.parent.surname}` : null,
      parentEmail: student.parent?.email ?? null,
      parentPhone: student.parent?.phone ?? null,
      attendanceCount: student._count.attendances,
      resultsCount: student._count.results,
      disciplineCount: student._count.disciplines,
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error("[teacher/students GET]", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}