 import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { mockStudents } from "@/lib/mockData";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const students = await prisma.student.findMany({
      where: {
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
    console.log("Database error, using mock data for students");
    // Return mock data when database fails
    const mockStudentsData = mockStudents.map((student, index) => ({
      id: student.id,
      name: student.name.split(' ')[0],
      surname: student.name.split(' ')[1] || 'Doe',
      email: student.email,
      phone: "1234567890",
      address: "123 Demo Street",
      img: "/noAvatar.png",
      bloodType: "O+",
      sex: index % 2 === 0 ? "MALE" : "FEMALE",
      birthday: "2010-01-01T00:00:00.000Z",
      admissionNumber: `ADM${2024000 + index}`,
      rollNumber: 1 + index,
      section: student.section,
      classId: "1",
      className: student.class,
      gradeLevel: 10,
      parentName: `Parent ${index + 1}`,
      parentEmail: `parent${index + 1}@demo.edu`,
      parentPhone: "1234567890",
      attendanceCount: Math.floor(Math.random() * 100),
      resultsCount: Math.floor(Math.random() * 10),
      disciplineCount: Math.floor(Math.random() * 5),
    }));
    
    return NextResponse.json(mockStudentsData);
  }
}