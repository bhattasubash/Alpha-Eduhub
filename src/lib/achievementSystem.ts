import prisma from "@/lib/prisma";
import { AchievementType } from "@prisma/client";

/**
 * Rule-based achievement system
 * Awards achievements based on actual database conditions without AI
 */

interface AchievementCheck {
  type: AchievementType;
  title: string;
  description: string;
  check: (studentId: string, schoolId: string) => Promise<boolean>;
}

const achievementRules: AchievementCheck[] = [
  {
    type: AchievementType.ATTENDANCE_PERFECT,
    title: "Perfect Attendance",
    description: "Achieved 100% attendance in the current academic year",
    check: async (studentId: string) => {
      const attendance = await prisma.attendance.findMany({
        where: {
          studentId,
          date: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
      });
      
      if (attendance.length === 0) return false;
      const presentDays = attendance.filter((a) => a.present).length;
      return presentDays === attendance.length;
    },
  },
  {
    type: AchievementType.ATTENDANCE_STREAK,
    title: "Attendance Streak",
    description: "Maintained attendance for 30 consecutive days",
    check: async (studentId: string) => {
      const attendance = await prisma.attendance.findMany({
        where: {
          studentId,
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: 'asc' },
      });
      
      if (attendance.length < 30) return false;
      return attendance.every((a) => a.present);
    },
  },
  {
    type: AchievementType.PERFORMANCE_IMPROVED,
    title: "Performance Improved",
    description: "Improved academic performance by 10% compared to previous exam",
    check: async (studentId: string) => {
      const results = await prisma.result.findMany({
        where: { studentId },
        include: {
          exam: true,
        },
        orderBy: {
          exam: {
            startTime: 'desc',
          },
        },
        take: 2,
      });
      
      if (results.length < 2) return false;
      const latest = results[0].percentage || 0;
      const previous = results[1].percentage || 0;
      return latest - previous >= 10;
    },
  },
  {
    type: AchievementType.PERSONAL_BEST,
    title: "Personal Best",
    description: "Achieved highest score in any subject",
    check: async (studentId: string) => {
      const results = await prisma.result.findMany({
        where: { studentId },
        orderBy: {
          percentage: 'desc',
        },
        take: 1,
      });
      
      if (results.length === 0) return false;
      return (results[0].percentage || 0) >= 95;
    },
  },
  {
    type: AchievementType.ASSIGNMENT_CHAMPION,
    title: "Assignment Champion",
    description: "Submitted all assignments on time with excellent scores",
    check: async (studentId: string) => {
      const submissions = await prisma.submission.findMany({
        where: {
          studentId,
          isLate: false,
        },
        include: {
          assignment: true,
        },
      });
      
      if (submissions.length === 0) return false;
      const excellentSubmissions = submissions.filter(
        (s) => (s.grade || 0) >= 90
      );
      return excellentSubmissions.length === submissions.length && submissions.length >= 5;
    },
  },
  {
    type: AchievementType.EXAM_EXCELLENCE,
    title: "Exam Excellence",
    description: "Scored above 90% in 3 or more consecutive exams",
    check: async (studentId: string) => {
      const results = await prisma.result.findMany({
        where: { studentId },
        include: {
          exam: true,
        },
        orderBy: {
          exam: {
            startTime: 'desc',
          },
        },
        take: 5,
      });
      
      if (results.length < 3) return false;
      const excellentResults = results.filter((r) => (r.percentage || 0) >= 90);
      return excellentResults.length >= 3;
    },
  },
  {
    type: AchievementType.SUBJECT_MASTER,
    title: "Subject Master",
    description: "Achieved 95% or higher in any subject",
    check: async (studentId: string) => {
      const results = await prisma.result.findMany({
        where: { studentId },
        include: {
          exam: {
            include: {
              lesson: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
      });
      
      if (results.length === 0) return false;
      return results.some((r) => (r.percentage || 0) >= 95);
    },
  },
  {
    type: AchievementType.EARLY_SUBMITTER,
    title: "Early Submitter",
    description: "Submitted assignments at least 2 days before deadline",
    check: async (studentId: string) => {
      const submissions = await prisma.submission.findMany({
        where: { studentId },
        include: {
          assignment: true,
        },
      });
      
      if (submissions.length === 0) return false;
      const earlySubmissions = submissions.filter((s) => {
        if (!s.assignment) return false;
        const daysEarly = Math.floor(
          (new Date(s.assignment.dueDate).getTime() - new Date(s.submittedAt).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        return daysEarly >= 2;
      });
      return earlySubmissions.length >= 3;
    },
  },
  {
    type: AchievementType.CONSISTENT_PERFORMER,
    title: "Consistent Performer",
    description: "Maintained average above 80% across all exams",
    check: async (studentId: string) => {
      const results = await prisma.result.findMany({
        where: { studentId },
      });
      
      if (results.length === 0) return false;
      const average = results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length;
      return average >= 80;
    },
  },
];

/**
 * Check and award achievements for a student
 */
export async function checkAndAwardAchievements(studentId: string, schoolId: string) {
  const existingAchievements = await prisma.studentAchievement.findMany({
    where: { studentId },
    select: { type: true },
  });

  const existingTypes = new Set(existingAchievements.map((a) => a.type as AchievementType));
  const newAchievements = [];

  for (const rule of achievementRules) {
    // Skip if already has this achievement
    if (existingTypes.has(rule.type)) continue;

    const isEligible = await rule.check(studentId, schoolId);
    
    if (isEligible) {
      await prisma.studentAchievement.create({
        data: {
          studentId,
          type: rule.type,
          title: rule.title,
          description: rule.description,
          schoolId,
        },
      });
      
      newAchievements.push(rule);
    }
  }

  return newAchievements;
}

/**
 * Manually award an achievement (for admin use)
 */
export async function awardAchievement(
  studentId: string,
  type: AchievementType,
  title: string,
  description: string,
  schoolId: string,
  metadata?: Record<string, unknown>
) {
  // Check if already exists
  const existing = await prisma.studentAchievement.findFirst({
    where: {
      studentId,
      type,
    },
  });

  if (existing) {
    throw new Error("Student already has this achievement");
  }

  return await prisma.studentAchievement.create({
    data: {
      studentId,
      type,
      title,
      description,
      metadata: metadata as import("@prisma/client").Prisma.InputJsonValue,
      schoolId,
    },
  });
}