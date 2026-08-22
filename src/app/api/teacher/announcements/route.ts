export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    // Get classes this teacher teaches
    const teacherClasses = await prisma.class.findMany({
      where: {
        lessons: {
          some: {
            teacherId,
          },
        },
      },
      select: { id: true },
    });

    const classIds = teacherClasses.map((c) => c.id);

    const announcements = await prisma.announcement.findMany({
      where: {
        schoolId,
        OR: [
          { classId: { in: classIds } },
          { classId: null }, // School-wide announcements
        ],
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    const formattedAnnouncements = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date.toISOString(),
      status: announcement.status,
      expiryDate: announcement.expiryDate?.toISOString() || null,
      classId: announcement.classId,
      className: announcement.class?.name || "School-wide",
      createdById: announcement.createdById,
      createdByRole: announcement.createdByRole,
    }));

    return NextResponse.json(formattedAnnouncements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, date, classId, status, expiryDate } = body;

    // If classId is provided, verify the teacher teaches that class
    if (classId) {
      const classExists = await prisma.class.findFirst({
        where: {
          id: classId,
          schoolId,
          lessons: {
            some: {
              teacherId,
            },
          },
        },
      });

      if (!classExists) {
        return NextResponse.json(
          { error: "Class not found or unauthorized" },
          { status: 404 }
        );
      }
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        date: new Date(date),
        classId: classId || null,
        status: status || "DRAFT",
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdById: teacherId,
        createdByRole: "TEACHER",
        schoolId,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date.toISOString(),
      status: announcement.status,
      expiryDate: announcement.expiryDate?.toISOString() || null,
      classId: announcement.classId,
      className: announcement.class?.name || "School-wide",
      createdById: announcement.createdById,
      createdByRole: announcement.createdByRole,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}