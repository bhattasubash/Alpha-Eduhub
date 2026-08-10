import prisma from "@/lib/prisma";
import { UserRole, NotificationType } from "@prisma/client";

/**
 * Helper functions for messaging with RBAC validation
 */

/**
 * Get valid recipients for a user based on their role and permissions
 */
export async function getValidRecipients(userId: string, userRole: string, schoolId: string) {
  const recipients: Array<{ id: string; name: string; role: string; relatedInfo?: any }> = [];

  if (userRole === "TEACHER" || userRole === "teacher") {
    // Teachers can message:
    // - Students in their assigned classes
    // - Parents of students in their assigned classes
    // - School admin
    // - Other teachers in their school

    // Get teacher's assigned classes
    const teacherClasses = await prisma.class.findMany({
      where: {
        supervisorId: userId,
        schoolId,
      },
      include: {
        students: {
          include: {
            parent: true,
          },
        },
      },
    });

    const studentIds = teacherClasses.flatMap((c) => c.students.map((s) => s.id));
    const parentIds = teacherClasses.flatMap((c) => c.students.map((s) => s.parentId));

    // Add students
    for (const cls of teacherClasses) {
      for (const student of cls.students) {
        recipients.push({
          id: student.id,
          name: `${student.name} ${student.surname}`,
          role: "STUDENT",
          relatedInfo: {
            class: cls.name,
            admissionNumber: student.admissionNumber,
          },
        });
      }
    }

    // Add parents
    for (const cls of teacherClasses) {
      for (const student of cls.students) {
        if (student.parentId && student.parent) {
          recipients.push({
            id: student.parentId,
            name: `${student.parent.name} ${student.parent.surname}`,
            role: "PARENT",
            relatedInfo: {
              childName: `${student.name} ${student.surname}`,
              class: cls.name,
            },
          });
        }
      }
    }

    // Add school admin
    const admin = await prisma.admin.findFirst({
      where: { schoolId },
    });
    if (admin) {
      recipients.push({
        id: admin.id,
        name: admin.username,
        role: "ADMIN",
      });
    }

    // Add other teachers
    const teachers = await prisma.teacher.findMany({
      where: {
        schoolId,
        id: { not: userId },
      },
    });
    for (const teacher of teachers) {
      recipients.push({
        id: teacher.id,
        name: `${teacher.name} ${teacher.surname}`,
        role: "TEACHER",
      });
    }
  }

  if (userRole === "STUDENT" || userRole === "student") {
    // Students can message:
    // - Their assigned teachers
    // - Their parent(s)
    // - School admin

    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        class: {
          include: {
            supervisor: true,
          },
        },
        parent: true,
      },
    });

    if (student) {
      // Add class teacher
      if (student.class?.supervisor) {
        recipients.push({
          id: student.class.supervisor.id,
          name: `${student.class.supervisor.name} ${student.class.supervisor.surname}`,
          role: "TEACHER",
        });
      }

      // Add parent (only if linked)
      if (student.parentId && student.parent) {
        recipients.push({
          id: student.parentId,
          name: `${student.parent.name} ${student.parent.surname}`,
          role: "PARENT",
        });
      }

      // Add school admin
      const admin = await prisma.admin.findFirst({
        where: { schoolId },
      });
      if (admin) {
        recipients.push({
          id: admin.id,
          name: admin.username,
          role: "ADMIN",
        });
      }
    }
  }

  if (userRole === "PARENT" || userRole === "parent") {
    // Parents can message:
    // - Teachers of their children
    // - School admin

    const parent = await prisma.parent.findUnique({
      where: { id: userId },
      include: {
        students: {
          include: {
            class: {
              include: {
                supervisor: true,
              },
            },
          },
        },
      },
    });

    if (parent) {
      // Add teachers of their children
      for (const student of parent.students) {
        if (student.class?.supervisor) {
          recipients.push({
            id: student.class.supervisor.id,
            name: `${student.class.supervisor.name} ${student.class.supervisor.surname}`,
            role: "TEACHER",
            relatedInfo: {
              childName: `${student.name} ${student.surname}`,
              class: student.class.name,
            },
          });
        }
      }

      // Add school admin
      const admin = await prisma.admin.findFirst({
        where: { schoolId },
      });
      if (admin) {
        recipients.push({
          id: admin.id,
          name: admin.username,
          role: "ADMIN",
        });
      }
    }
  }

  if (userRole === "ADMIN" || userRole === "SCHOOL_ADMIN" || userRole === "admin") {
    // Admins can message:
    // - All teachers in their school
    // - All students in their school
    // - All parents in their school

    const teachers = await prisma.teacher.findMany({
      where: { schoolId },
    });
    for (const teacher of teachers) {
      recipients.push({
        id: teacher.id,
        name: `${teacher.name} ${teacher.surname}`,
        role: "TEACHER",
      });
    }

    const students = await prisma.student.findMany({
      where: { schoolId },
    });
    for (const student of students) {
      recipients.push({
        id: student.id,
        name: `${student.name} ${student.surname}`,
        role: "STUDENT",
      });
    }

    const parents = await prisma.parent.findMany({
      where: { schoolId },
    });
    for (const parent of parents) {
      recipients.push({
        id: parent.id,
        name: `${parent.name} ${parent.surname}`,
        role: "PARENT",
      });
    }
  }

  if (userRole === "SUPER_ADMIN" || userRole === "super_admin") {
    // Super Admin can message users across schools
    // This is more complex and would need school context
    // For now, return empty as this needs more specific implementation
  }

  return recipients;
}

/**
 * Validate if sender can message receiver
 */
export async function canSendMessage(senderId: string, receiverId: string, senderRole: string, schoolId: string): Promise<boolean> {
  const validRecipients = await getValidRecipients(senderId, senderRole, schoolId);
  return validRecipients.some((r) => r.id === receiverId);
}

/**
 * Create a notification
 */
export async function createNotification({
  userId,
  userType,
  type,
  title,
  message,
  data,
  actionUrl,
  schoolId,
}: {
  userId: string;
  userType: UserRole | string;
  type: NotificationType | string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  schoolId: string;
}) {
  return await prisma.notification.create({
    data: {
      userId,
      userType: userType as UserRole,
      type: type as NotificationType,
      title,
      message,
      data: data as import("@prisma/client").Prisma.InputJsonValue | undefined,
      actionUrl,
      schoolId,
    },
  });
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string, schoolId: string): Promise<number> {
  return await prisma.notification.count({
    where: {
      userId,
      schoolId,
      isRead: false,
    },
  });
}
