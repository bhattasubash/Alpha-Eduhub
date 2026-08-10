import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodType: true,
        sex: true,
        birthday: true,
        employeeId: true,
        qualification: true,
        designation: true,
        department: true,
        joiningDate: true,
        createdAt: true,
        schoolId: true,
        school: {
          select: {
            name: true,
          },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
        lessons: {
          select: {
            id: true,
            name: true,
            day: true,
            startTime: true,
            endTime: true,
            class: {
              select: { name: true },
            },
            subject: {
              select: { name: true },
            },
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

    return NextResponse.json({
      id: teacher.id,
      username: teacher.username,
      name: teacher.name,
      surname: teacher.surname,
      email: teacher.email,
      phone: teacher.phone,
      address: teacher.address,
      img: teacher.img,
      bloodType: teacher.bloodType,
      sex: teacher.sex,
      birthday: teacher.birthday.toISOString(),
      employeeId: teacher.employeeId,
      qualification: teacher.qualification,
      designation: teacher.designation,
      department: teacher.department,
      joiningDate: teacher.joiningDate?.toISOString() || null,
      createdAt: teacher.createdAt.toISOString(),
      schoolId: teacher.schoolId,
      schoolName: teacher.school.name,
      subjects: teacher.subjects,
      classes: teacher.classes,
      lessons: teacher.lessons.map((lesson) => ({
        id: lesson.id,
        name: lesson.name,
        day: lesson.day,
        startTime: lesson.startTime.toISOString(),
        endTime: lesson.endTime.toISOString(),
        className: lesson.class.name,
        subjectName: lesson.subject.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const body = await request.json();
    const { name, surname, email, phone, address, qualification, designation, department } = body;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          email,
          id: { not: teacherId },
        },
      });

      if (existingTeacher) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Check if phone is being changed and if it's already taken
    if (phone) {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          phone,
          id: { not: teacherId },
        },
      });

      if (existingTeacher) {
        return NextResponse.json(
          { error: "Phone number already in use" },
          { status: 400 }
        );
      }
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        name,
        surname,
        email,
        phone,
        address,
        qualification,
        designation,
        department,
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodType: true,
        sex: true,
        birthday: true,
        employeeId: true,
        qualification: true,
        designation: true,
        department: true,
        joiningDate: true,
        createdAt: true,
        schoolId: true,
        school: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: teacher.id,
      username: teacher.username,
      name: teacher.name,
      surname: teacher.surname,
      email: teacher.email,
      phone: teacher.phone,
      address: teacher.address,
      img: teacher.img,
      bloodType: teacher.bloodType,
      sex: teacher.sex,
      birthday: teacher.birthday.toISOString(),
      employeeId: teacher.employeeId,
      qualification: teacher.qualification,
      designation: teacher.designation,
      department: teacher.department,
      joiningDate: teacher.joiningDate?.toISOString() || null,
      createdAt: teacher.createdAt.toISOString(),
      schoolId: teacher.schoolId,
      schoolName: teacher.school.name,
    });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to update teacher profile" },
      { status: 500 }
    );
  }
}