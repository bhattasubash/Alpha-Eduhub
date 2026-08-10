import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    const schoolId = session.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get("class");

    // Fetch students with classes and parents matching school & optional class filter
    const students = await prisma.student.findMany({
      where: {
        schoolId,
        ...(classFilter ? { class: { name: classFilter } } : {})
      },
      include: {
        class: { select: { name: true } },
        parent: { select: { name: true, surname: true, phone: true } }
      },
      orderBy: { name: "asc" }
    });

    if (students.length === 0) {
      return NextResponse.json(
        { error: "No student records found matching the filter." },
        { status: 404 }
      );
    }

    const data = students.map((s) => ({
      'Student Name': `${s.name} ${s.surname}`,
      'Student Login (Email)': s.email || s.username,
      'Student Password': 'Student@123',
      'Parent Name': s.parent ? `${s.parent.name} ${s.parent.surname}` : 'N/A',
      'Parent Mobile (Login)': s.parent ? s.parent.phone : 'N/A',
      'Parent Password': s.parent ? 'Student@123' : 'N/A',
      'Class': s.class?.name || 'N/A'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Student Name
      { wch: 35 }, // Student Login (Email)
      { wch: 20 }, // Student Password
      { wch: 25 }, // Parent Name
      { wch: 20 }, // Parent Mobile (Login)
      { wch: 20 }, // Parent Password
      { wch: 15 }, // Class
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Credentials');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = classFilter 
      ? `class_${classFilter.replace(/[^a-zA-Z0-9]/g, '_')}_credentials.xlsx`
      : 'student_credentials.xlsx';

    // Return file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error("Credentials export error:", error);
    return NextResponse.json(
      { error: "Failed to export credentials" },
      { status: 500 }
    );
  }
}
