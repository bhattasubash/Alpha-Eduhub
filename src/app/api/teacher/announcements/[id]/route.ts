import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const announcementId = parseInt(id);

    const body = await request.json();
    const { title, description, date, classId, status, expiryDate } = body;

    // Verify the announcement belongs to this teacher
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        schoolId,
        createdById: teacherId,
        createdByRole: "TEACHER",
      },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found or unauthorized" },
        { status: 404 }
      );
    }

    // If classId is being changed, verify the teacher teaches that class
    if (classId && classId !== existingAnnouncement.classId) {
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

    const announcement = await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        classId,
        status,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
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
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const announcementId = parseInt(id);

    // Verify the announcement belongs to this teacher
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: {
        id: announcementId,
        schoolId,
        createdById: teacherId,
        createdByRole: "TEACHER",
      },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}