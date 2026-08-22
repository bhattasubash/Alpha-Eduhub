export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    // Since we don't have a dedicated Task table, we'll return mock data
    // In a real implementation, you'd have a Task model
    
    const mockTasks = [
      {
        id: 1,
        title: "Mark attendance for Class 4A",
        description: "Complete attendance for morning session",
        type: "attendance" as const,
        priority: "high" as const,
        dueDate: new Date().toISOString(),
        dueTime: "09:00",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Upload mathematics test marks",
        description: "Enter marks for the mid-term examination",
        type: "marks" as const,
        priority: "urgent" as const,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        dueTime: "17:00",
        completed: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        title: "Review homework submissions",
        description: "Check and grade submitted homework",
        type: "homework" as const,
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        title: "Parent meeting preparation",
        description: "Prepare notes for parent-teacher meeting",
        type: "meeting" as const,
        priority: "medium" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        title: "Submit lesson plan",
        description: "Weekly lesson plan submission",
        type: "custom" as const,
        priority: "low" as const,
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
        createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json(mockTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["teacher", "TEACHER"]);
    const teacherId = session.userId;

    const body = await request.json();
    const { title, description, type, priority, dueDate, dueTime } = body;

    if (!title || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real implementation, you'd create a Task record here
    // For now, we'll simulate success
    
    const newTask = {
      id: Date.now(),
      title,
      description: description || "",
      type: type || "custom",
      priority: priority || "medium",
      dueDate: new Date(dueDate).toISOString(),
      dueTime: dueTime || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
