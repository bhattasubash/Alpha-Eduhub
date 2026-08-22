export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);

    // Create template data
    const templateData = [
      {
        'Student Name': 'Rahul Kumar',
        'Date of Birth': '2010-05-15',
        'Gender': 'MALE',
        'Class': '8 A',
        'Section': 'A',
        'Parent Name': 'Raj Kumar',
        'Parent Mobile': '9876543210',
        'Parent Email': 'parent@example.com',
        'Address': '123 Main Street, City',
        'Admission Date': '2024-06-01'
      },
      {
        'Student Name': 'Ananya Singh',
        'Date of Birth': '2010-08-20',
        'Gender': 'FEMALE',
        'Class': '8 A',
        'Section': 'A',
        'Parent Name': 'Vijay Singh',
        'Parent Mobile': '9876543211',
        'Parent Email': 'parent2@example.com',
        'Address': '456 Park Avenue, City',
        'Admission Date': '2024-06-01'
      }
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Student Name
      { wch: 15 }, // Date of Birth
      { wch: 10 }, // Gender
      { wch: 10 }, // Class
      { wch: 10 }, // Section
      { wch: 20 }, // Parent Name
      { wch: 15 }, // Parent Mobile
      { wch: 25 }, // Parent Email
      { wch: 30 }, // Address
      { wch: 15 }, // Admission Date
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Import Template');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="student_import_template.xlsx"'
      }
    });

  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}