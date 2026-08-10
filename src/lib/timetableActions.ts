"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/getRole";
import { revalidatePath } from "next/cache";

// Reference date we use to store time-only values in DateTime fields
const EPOCH = "2000-01-03"; // A Monday — so day name aligns naturally

function buildDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
}

// Map day name to a date on the reference week (Mon=Jan3, Tue=Jan4, …)
const DAY_OFFSET: Record<string, number> = {
  MONDAY: 0, TUESDAY: 1, WEDNESDAY: 2, THURSDAY: 3, FRIDAY: 4,
};

function dateForDay(day: string, timeStr: string): Date {
  const base = new Date(`${EPOCH}T${timeStr}:00.000Z`);
  base.setDate(base.getDate() + (DAY_OFFSET[day] ?? 0));
  return base;
}

export async function saveTimetableEntry(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, message: "Unauthorized" };

    const classId    = parseInt(formData.get("classId") as string);
    const day        = formData.get("day") as string;
    const subjectId  = parseInt(formData.get("subjectId") as string);
    const teacherId  = formData.get("teacherId") as string;
    const startStr   = formData.get("startTime") as string; // "HH:MM"
    const endStr     = formData.get("endTime") as string;
    const lessonName = formData.get("lessonName") as string;
    const lessonIdRaw = formData.get("lessonId") as string | null;

    const startTime = dateForDay(day, startStr);
    const endTime   = dateForDay(day, endStr);

    if (lessonIdRaw) {
      // UPDATE existing lesson
      const lessonId = parseInt(lessonIdRaw);
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { subjectId, teacherId, startTime, endTime, name: lessonName },
      });
    } else {
      // CREATE new lesson
      await prisma.lesson.create({
        data: {
          name: lessonName,
          day: day as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY",
          startTime,
          endTime,
          subjectId,
          teacherId,
          classId,
          schoolId: session.schoolId,
        },
      });
    }

    revalidatePath("/admin/timetable");
    revalidatePath("/teacher");
    revalidatePath("/student");
    return { success: true };
  } catch (err) {
    console.error("[saveTimetableEntry]", err);
    return { success: false, message: "Failed to save. Check if teacher is linked to this subject." };
  }
}

export async function deleteTimetableEntry(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    const id = parseInt(formData.get("id") as string);
    if (!id) return { success: false, message: "Missing lesson ID" };

    // Safely remove dependents first
    await prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { lessonId: id } });
      await tx.exam.deleteMany({ where: { lessonId: id } });
      await tx.assignment.deleteMany({ where: { lessonId: id } });
      await tx.lesson.delete({ where: { id } });
    });

    revalidatePath("/admin/timetable");
    revalidatePath("/teacher");
    revalidatePath("/student");
    return { success: true };
  } catch (err) {
    console.error("[deleteTimetableEntry]", err);
    return { success: false, message: "Failed to delete lesson." };
  }
}
