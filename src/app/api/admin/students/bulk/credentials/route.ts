export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    
    const body = await request.json();
    const { type, credentials } = body;

    if (!type || !credentials) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    let data: any[];
    let filename: string;

    if (type === 'student') {
      data = credentials.map((cred: any) => ({
        'Student Name': cred.studentName,
        'Admission Number': cred.admissionNumber,
        'Class': cred.class,
        'Section': cred.section,
        'Student Login': cred.login,
        'Temporary Password': cred.temporaryPassword
      }));
      filename = 'student_credentials.xlsx';
    } else if (type === 'parent') {
      data = credentials.map((cred: any) => ({
        'Parent Name': cred.parentName,
        'Mobile Number': cred.mobileNumber,
        'Temporary Password': cred.temporaryPassword,
        'Linked Children': cred.linkedChildren.join(', ')
      }));
      filename = 'parent_credentials.xlsx';
    } else {
      return NextResponse.json(
        { error: "Invalid credential type" },
        { status: 400 }
      );
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    if (type === 'student') {
      worksheet['!cols'] = [
        { wch: 25 }, // Student Name
        { wch: 20 }, // Admission Number
        { wch: 10 }, // Class
        { wch: 10 }, // Section
        { wch: 35 }, // Student Login
        { wch: 20 }, // Temporary Password
      ];
    } else {
      worksheet['!cols'] = [
        { wch: 25 }, // Parent Name
        { wch: 15 }, // Mobile Number
        { wch: 20 }, // Temporary Password
        { wch: 50 }, // Linked Children
      ];
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Credentials');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

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