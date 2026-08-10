import prisma from "@/lib/prisma";
import { createNotification } from "./messaging";

/**
 * Notification triggers for various events
 */

/**
 * Trigger notification when student is marked absent
 */
export async function triggerAttendanceAbsentNotification(studentId: string, schoolId: string, date: Date) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true, class: true },
  });

  if (!student || !student.parentId) return;

  await createNotification({
    userId: student.parentId,
    userType: "PARENT",
    type: "ATTENDANCE_ABSENT",
    title: "Absent from Class",
    message: `${student.name} ${student.surname} was marked absent on ${date.toLocaleDateString()}`,
    data: { studentId, date: date.toISOString() },
    actionUrl: "/attendance",
    schoolId,
  });
}

/**
 * Trigger notification when attendance falls below threshold
 */
export async function triggerAttendanceThresholdNotification(studentId: string, schoolId: string, currentPercentage: number, threshold: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "ATTENDANCE_THRESHOLD",
      title: "Attendance Warning",
      message: `${student.name} ${student.surname}'s attendance (${currentPercentage}%) is below the required threshold (${threshold}%)`,
      data: { studentId, currentPercentage, threshold },
      actionUrl: "/attendance",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "ATTENDANCE_THRESHOLD",
    title: "Attendance Warning",
    message: `Your attendance (${currentPercentage}%) is below the required threshold (${threshold}%)`,
    data: { currentPercentage, threshold },
    actionUrl: "/attendance",
    schoolId,
  });
}

/**
 * Trigger notification when marks are published
 */
export async function triggerMarksPublishedNotification(studentId: string, schoolId: string, examName: string, subject: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "MARKS_PUBLISHED",
      title: "Marks Published",
      message: `Marks for ${examName} in ${subject} have been published`,
      data: { studentId, examName, subject },
      actionUrl: "/academics",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "MARKS_PUBLISHED",
    title: "Marks Published",
    message: `Your marks for ${examName} in ${subject} have been published`,
    data: { examName, subject },
    actionUrl: "/academics",
    schoolId,
  });
}

/**
 * Trigger notification when exam results are published
 */
export async function triggerExamResultNotification(studentId: string, schoolId: string, examTitle: string, percentage: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "EXAM_RESULT_PUBLISHED",
      title: "Exam Result Published",
      message: `${student.name} ${student.surname} scored ${percentage}% in ${examTitle}`,
      data: { studentId, examTitle, percentage },
      actionUrl: "/exams",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "EXAM_RESULT_PUBLISHED",
    title: "Exam Result Published",
    message: `You scored ${percentage}% in ${examTitle}`,
    data: { examTitle, percentage },
    actionUrl: "/exams",
    schoolId,
  });
}

/**
 * Trigger notification when assignment is created
 */
export async function triggerAssignmentCreatedNotification(studentId: string, schoolId: string, assignmentTitle: string, dueDate: Date) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) return;

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "ASSIGNMENT_CREATED",
    title: "New Assignment",
    message: `New assignment: ${assignmentTitle} due on ${dueDate.toLocaleDateString()}`,
    data: { assignmentTitle, dueDate: dueDate.toISOString() },
    actionUrl: "/assignments",
    schoolId,
  });
}

/**
 * Trigger notification when assignment is graded
 */
export async function triggerAssignmentGradedNotification(studentId: string, schoolId: string, assignmentTitle: string, grade: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "ASSIGNMENT_GRADED",
      title: "Assignment Graded",
      message: `${student.name} ${student.surname}'s assignment "${assignmentTitle}" has been graded`,
      data: { studentId, assignmentTitle, grade },
      actionUrl: "/assignments",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "ASSIGNMENT_GRADED",
    title: "Assignment Graded",
    message: `Your assignment "${assignmentTitle}" has been graded`,
    data: { assignmentTitle, grade },
    actionUrl: "/assignments",
    schoolId,
  });
}

/**
 * Trigger notification when leave is submitted
 */
export async function triggerLeaveSubmittedNotification(studentId: string, schoolId: string, leaveType: string, startDate: Date, endDate: Date) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: {
        include: {
          supervisor: true,
        },
      },
    },
  });

  if (!student) return;

  if (student.class?.supervisor) {
    await createNotification({
      userId: student.class.supervisor.id,
      userType: "TEACHER",
      type: "LEAVE_SUBMITTED",
      title: "Leave Request Submitted",
      message: `${student.name} ${student.surname} has applied for ${leaveType} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      data: { studentId, leaveType, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      actionUrl: "/student-leave",
      schoolId,
    });
  }
}

/**
 * Trigger notification when leave is approved
 */
export async function triggerLeaveApprovedNotification(studentId: string, schoolId: string, leaveType: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "LEAVE_APPROVED",
      title: "Leave Approved",
      message: `${student.name} ${student.surname}'s ${leaveType} has been approved`,
      data: { studentId, leaveType },
      actionUrl: "/leave",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "LEAVE_APPROVED",
    title: "Leave Approved",
    message: `Your ${leaveType} has been approved`,
    data: { leaveType },
    actionUrl: "/leave",
    schoolId,
  });
}

/**
 * Trigger notification when leave is rejected
 */
export async function triggerLeaveRejectedNotification(studentId: string, schoolId: string, leaveType: string, reason?: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "LEAVE_REJECTED",
      title: "Leave Rejected",
      message: `${student.name} ${student.surname}'s ${leaveType} has been rejected${reason ? `: ${reason}` : ""}`,
      data: { studentId, leaveType, reason },
      actionUrl: "/leave",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "LEAVE_REJECTED",
    title: "Leave Rejected",
    message: `Your ${leaveType} has been rejected${reason ? `: ${reason}` : ""}`,
    data: { leaveType, reason },
    actionUrl: "/leave",
    schoolId,
  });
}

/**
 * Trigger notification when teacher applies for leave - notifies all students in their classes
 */
export async function triggerTeacherLeaveNotification(
  studentIds: string[],
  schoolId: string,
  teacherId: string,
  leaveType: string,
  startDate: Date,
  endDate: Date
) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  if (!teacher) return;

  const teacherName = `${teacher.name} ${teacher.surname}`;

  for (const studentId of studentIds) {
    await createNotification({
      userId: studentId,
      userType: "STUDENT",
      type: "TEACHER_LEAVE",
      title: "Teacher on Leave",
      message: `${teacherName} will be on ${leaveType} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      data: { teacherId, teacherName, leaveType, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      actionUrl: "/timetable",
      schoolId,
    });
  }
}

/**
 * Trigger notification when fee invoice is generated
 */
export async function triggerFeeInvoiceNotification(studentId: string, schoolId: string, amount: number, dueDate: Date) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student) return;

  if (student.parentId) {
    await createNotification({
      userId: student.parentId,
      userType: "PARENT",
      type: "FEE_INVOICE",
      title: "Fee Invoice Generated",
      message: `New fee invoice of $${amount} generated for ${student.name} ${student.surname}. Due: ${dueDate.toLocaleDateString()}`,
      data: { studentId, amount, dueDate: dueDate.toISOString() },
      actionUrl: "/fees",
      schoolId,
    });
  }

  await createNotification({
    userId: studentId,
    userType: "STUDENT",
    type: "FEE_INVOICE",
    title: "Fee Invoice Generated",
    message: `New fee invoice of $${amount} generated. Due: ${dueDate.toLocaleDateString()}`,
    data: { amount, dueDate: dueDate.toISOString() },
    actionUrl: "/fees",
    schoolId,
  });
}

/**
 * Trigger notification when fee payment is recorded
 */
export async function triggerFeePaymentNotification(studentId: string, schoolId: string, amount: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student || !student.parentId) return;

  await createNotification({
    userId: student.parentId,
    userType: "PARENT",
    type: "FEE_PAYMENT",
    title: "Payment Recorded",
    message: `Payment of $${amount} recorded for ${student.name} ${student.surname}`,
    data: { studentId, amount },
    actionUrl: "/fees",
    schoolId,
  });
}

/**
 * Trigger notification when fee is due
 */
export async function triggerFeeDueNotification(studentId: string, schoolId: string, amount: number, dueDate: Date) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student || !student.parentId) return;

  await createNotification({
    userId: student.parentId,
    userType: "PARENT",
    type: "FEE_DUE",
    title: "Fee Payment Due",
    message: `Fee payment of $${amount} is due on ${dueDate.toLocaleDateString()} for ${student.name} ${student.surname}`,
    data: { studentId, amount, dueDate: dueDate.toISOString() },
    actionUrl: "/fees",
    schoolId,
  });
}
