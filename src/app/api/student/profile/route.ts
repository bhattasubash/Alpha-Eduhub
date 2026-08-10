import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        admissionNumber: true,
        rollNumber: true,
        birthday: true,
        bloodType: true,
        sex: true,
        class: {
          select: {
            name: true,
          },
        },
        grade: {
          select: {
            level: true,
          },
        },
        section: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession(["student", "STUDENT"]);
    const studentId = session.userId;

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    console.log("Password change request:", { studentId });

    // Get current student data
    const currentStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!currentStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get the user record for password verification
    const userRecord = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // Verify current password
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, userRecord.passwordHash);

    if (!isPasswordValid) {
      console.error("Invalid current password");
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: studentId },
      data: { passwordHash: newPasswordHash },
    });

    console.log("Password updated successfully");
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to update password", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
