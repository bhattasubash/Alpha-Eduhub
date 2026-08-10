import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    // In a real implementation, you'd calculate this from the LeaveRequest table
    // For now, we'll return mock data
    
    const balance = {
      casual: 10,
      sick: 5,
      earned: 15,
      total: 30,
    };

    return NextResponse.json(balance);
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave balance" },
      { status: 500 }
    );
  }
}
