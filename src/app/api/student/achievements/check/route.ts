export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import { checkAndAwardAchievements } from "@/lib/achievementSystem";

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["student", "STUDENT", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const studentId = session.userId;
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context not found" },
        { status: 400 }
      );
    }

    const newAchievements = await checkAndAwardAchievements(studentId, schoolId);

    return NextResponse.json({
      success: true,
      newAchievements,
      message: newAchievements.length > 0 
        ? `Awarded ${newAchievements.length} new achievement(s)` 
        : "No new achievements to award",
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Failed to check achievements" },
      { status: 500 }
    );
  }
}
