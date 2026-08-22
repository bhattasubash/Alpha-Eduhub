export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import { triggerMarksPublishedNotification, triggerExamResultNotification } from "@/lib/notificationTriggers";

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const body = await request.json();
    const { type, assessmentId, records } = body;

    if (!type || !assessmentId || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get teacher's school ID
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { schoolId: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Process each mark record
    const markData = records.map((record: { studentId: string; score: number | null }) => ({
      studentId: record.studentId,
      score: record.score,
      schoolId: teacher.schoolId,
    }));

    // Delete existing marks for this assessment
    const studentIds = records.map((r: any) => r.studentId);
    
    if (type === "exam") {
      await prisma.result.deleteMany({
        where: {
          examId: assessmentId,
          studentId: { in: studentIds },
        },
      });

      // Get exam details for notifications
      const exam = await prisma.exam.findUnique({
        where: { id: assessmentId },
        include: {
          lesson: {
            include: {
              subject: true,
            },
          },
        },
      });

      // Create new result records
      for (const mark of markData) {
        if (mark.score !== null) {
          await prisma.result.create({
            data: {
              studentId: mark.studentId,
              examId: assessmentId,
              score: mark.score,
              schoolId: mark.schoolId,
            },
          });

          // Trigger notification
          const student = await prisma.student.findUnique({
            where: { id: mark.studentId },
          });

          if (student && exam) {
            const percentage = Math.round((mark.score / exam.maxMarks) * 100);
            await triggerExamResultNotification(
              mark.studentId,
              teacher.schoolId,
              exam.title,
              percentage
            );
          }
        }
      }
    } else if (type === "assignment") {
      // Similar logic for assignments
      await prisma.result.deleteMany({
        where: {
          assignmentId: assessmentId,
          studentId: { in: studentIds },
        },
      });

      // Get assignment details for notifications
      const assignment = await prisma.assignment.findUnique({
        where: { id: assessmentId },
      });

      for (const mark of markData) {
        if (mark.score !== null) {
          await prisma.result.create({
            data: {
              studentId: mark.studentId,
              assignmentId: assessmentId,
              score: mark.score,
              schoolId: mark.schoolId,
            },
          });

          // Trigger notification
          if (assignment) {
            await triggerMarksPublishedNotification(
              mark.studentId,
              teacher.schoolId,
              assignment.title,
              assignment.lessonName || "Assignment"
            );
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "Marks saved successfully" });
  } catch (error) {
    console.error("Error saving marks:", error);
    return NextResponse.json(
      { error: "Failed to save marks" },
      { status: 500 }
    );
  }
}
