export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/getRole";
import prisma from "@/lib/prisma";
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';

interface BulkStudentRow {
  studentName: string;
  dateOfBirth: string;
  gender: string;
  class: string;
  section: string;
  parentName: string;
  parentMobile: string;
  parentEmail?: string;
  address: string;
  admissionDate?: string;
}

interface ValidationResult {
  row: number;
  status: 'valid' | 'error' | 'warning';
  data: BulkStudentRow;
  errors: string[];
  warnings: string[];
}

interface ImportResult {
  studentsCreated: number;
  parentsCreated: number;
  existingParentsReused: number;
  warnings: number;
  errors: number;
  studentCredentials: Array<{
    studentName: string;
    admissionNumber: string;
    class: string;
    section: string;
    login: string;
    temporaryPassword: string;
  }>;
  parentCredentials: Array<{
    parentName: string;
    mobileNumber: string;
    temporaryPassword: string;
    linkedChildren: string[];
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["admin", "SCHOOL_ADMIN", "SUPER_ADMIN"]);
    
    const formData = await request.formData();
    let schoolId = session.schoolId;
    
    // Handle Super Admin with context switching
    if ((session.role === "SUPER_ADMIN" || session.role === "provider") && !schoolId) {
      schoolId = (formData.get('schoolId') as string | null) ?? null;
    }

    if (!schoolId) {
      return NextResponse.json(
        { error: "School context required" },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    const action = formData.get('action') as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Get school configuration
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { studentLoginDomain: true }
    });

    const studentDomain = school?.studentLoginDomain || 'school.edu';

    // Parse Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (action === 'validate') {
      return await validateImport(jsonData, schoolId, studentDomain);
    } else if (action === 'import') {
      const selectedRows = formData.get('selectedRows') as string;
      const rowsToImport = JSON.parse(selectedRows);
      const commonPassword = (formData.get('commonPassword') as string) || '';
      return await processImport(jsonData, rowsToImport, schoolId, studentDomain, session.username, commonPassword);
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk import" },
      { status: 500 }
    );
  }
}

async function validateImport(
  jsonData: any[],
  schoolId: string,
  studentDomain: string
): Promise<NextResponse> {
  const validationResults: ValidationResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get existing data for validation
  const [existingStudents, existingParents, classes, grades] = await Promise.all([
    prisma.student.findMany({
      where: { schoolId },
      select: { name: true, surname: true, birthday: true, admissionNumber: true }
    }),
    prisma.parent.findMany({
      where: { schoolId },
      select: { phone: true, name: true, surname: true }
    }),
    prisma.class.findMany({
      where: { schoolId },
      include: { grade: true }
    }),
    prisma.grade.findMany({
      where: { schoolId }
    })
  ]);

  const studentMap = new Map(
    existingStudents.map(s => [`${s.name.toLowerCase()}-${s.surname.toLowerCase()}-${s.birthday.toISOString().split('T')[0]}`, true] as const)
  );
  const admissionNumbers = new Set(existingStudents.map(s => s.admissionNumber).filter(Boolean));
  const parentMobiles = new Set(existingParents.map(p => p.phone));
  const classMap = new Map(
    classes.map(c => [`${c.name.toLowerCase()}-${c.grade.level}`, c] as const)
  );

  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    const rowNum = i + 2; // Excel row numbers start from 1, header is row 1
    const result: ValidationResult = {
      row: rowNum,
      status: 'valid',
      data: {
        studentName: row['Student Name'] || '',
        dateOfBirth: row['Date of Birth'] || '',
        gender: row['Gender'] || '',
        class: row['Class'] || '',
        section: row['Section'] || '',
        parentName: row['Parent Name'] || '',
        parentMobile: row['Parent Mobile'] || '',
        parentEmail: row['Parent Email'] || '',
        address: row['Address'] || '',
        admissionDate: row['Admission Date'] || ''
      },
      errors: [],
      warnings: []
    };

    // Validate required fields
    if (!result.data.studentName) {
      result.errors.push('Student Name is required');
    }
    if (!result.data.dateOfBirth) {
      result.errors.push('Date of Birth is required');
    } else if (!isValidDate(result.data.dateOfBirth)) {
      result.errors.push('Invalid Date of Birth format');
    }
    if (!result.data.class) {
      result.errors.push('Class is required');
    }
    if (!result.data.section) {
      result.errors.push('Section is required');
    }
    if (!result.data.parentName) {
      result.errors.push('Parent Name is required');
    }
    if (!result.data.parentMobile) {
      result.errors.push('Parent Mobile is required');
    } else if (!isValidMobile(result.data.parentMobile)) {
      result.errors.push('Invalid Parent Mobile number format');
    }
    if (!result.data.address) {
      result.errors.push('Address is required');
    }

    // Validate email if provided
    if (result.data.parentEmail && !isValidEmail(result.data.parentEmail)) {
      result.errors.push('Invalid Parent Email format');
    }

    // Validate gender
    if (result.data.gender && !['MALE', 'FEMALE', 'Male', 'Female', 'M', 'F'].includes(result.data.gender)) {
      result.warnings.push('Gender should be MALE or FEMALE');
    }

    // Validate class exists
    if (result.data.class) {
      const classParts = result.data.class.split(' ');
      const gradeLevel = parseInt(classParts[0]) || parseInt(classParts[classParts.length - 1]);
      const className = classParts.find(p => isNaN(parseInt(p))) || result.data.class;
      
      if (!classMap.has(`${className.toLowerCase()}-${gradeLevel}`)) {
        result.errors.push(`Class ${result.data.class} does not exist in the system`);
      }
    }

    // Check for duplicate student
    if (result.data.studentName && result.data.dateOfBirth) {
      const dob = new Date(result.data.dateOfBirth).toISOString().split('T')[0];
      const nameParts = result.data.studentName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      if (studentMap.has(`${firstName.toLowerCase()}-${lastName.toLowerCase()}-${dob}`)) {
        result.warnings.push('Student with same name and date of birth already exists');
      }
    }

    // Check for duplicate parent mobile
    if (result.data.parentMobile && parentMobiles.has(result.data.parentMobile)) {
      result.warnings.push('Parent with this mobile number already exists (will be linked to existing parent)');
    }

    // Determine status
    if (result.errors.length > 0) {
      result.status = 'error';
      errors.push(`Row ${rowNum}: ${result.errors.join(', ')}`);
    } else if (result.warnings.length > 0) {
      result.status = 'warning';
      warnings.push(`Row ${rowNum}: ${result.warnings.join(', ')}`);
    }

    validationResults.push(result);
  }

  const validRows = validationResults.filter(r => r.status === 'valid' || r.status === 'warning');
  const errorRows = validationResults.filter(r => r.status === 'error');

  return NextResponse.json({
    totalRows: jsonData.length,
    validRows: validRows.length,
    errorRows: errorRows.length,
    warningCount: warnings.length,
    errorCount: errors.length,
    validationResults,
    errorMessages: errors,
    warningMessages: warnings,
  });
}

async function processImport(
  jsonData: any[],
  selectedRows: number[],
  schoolId: string,
  studentDomain: string,
  adminUsername: string,
  commonPassword?: string
): Promise<NextResponse> {
  const result: ImportResult = {
    studentsCreated: 0,
    parentsCreated: 0,
    existingParentsReused: 0,
    warnings: 0,
    errors: 0,
    studentCredentials: [],
    parentCredentials: []
  };

  try {
    // Process in a transaction
    await prisma.$transaction(async (tx) => {
      const [classes, grades, lastAdmission, school] = await Promise.all([
        tx.class.findMany({
          where: { schoolId },
          include: { grade: true }
        }),
        tx.grade.findMany({
          where: { schoolId },
          orderBy: { level: 'desc' }
        }),
        tx.student.findFirst({
          where: { schoolId },
          orderBy: { admissionNumber: 'desc' },
          select: { admissionNumber: true }
        }),
        tx.school.findUnique({
          where: { id: schoolId },
          select: { name: true },
        }),
      ]);

      const classMap = new Map(
        classes.map(c => [`${c.name.toLowerCase()}-${c.grade.level}`, c])
      );

      // Generate next admission number
      let nextAdmissionNum = 1;
      if (lastAdmission?.admissionNumber) {
        const match = lastAdmission.admissionNumber.match(/\d+$/);
        if (match) {
          nextAdmissionNum = parseInt(match[0]) + 1;
        }
      }

      const currentYear = new Date().getFullYear();
      const parentMap = new Map<string, string>(); // mobile -> parentId
      const usedLogins = new Set<string>();

      for (const rowIndex of selectedRows) {
        const row = jsonData[rowIndex];
        
        try {
          // Parse student data
          const nameParts = (row['Student Name'] as string).split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join('') || '';
          const dob = new Date(row['Date of Birth']);
          const gender = (row['Gender'] as string).toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE';
          const className = row['Class'] as string;
          const section = row['Section'] as string;
          const parentName = row['Parent Name'] as string;
          const parentMobile = row['Parent Mobile'] as string;
          const parentEmail = row['Parent Email'] as string;
          const address = row['Address'] as string;
          const admissionDate = row['Admission Date'] ? new Date(row['Admission Date']) : new Date();

          // Find class
          const classParts = className.split(' ');
          const gradeLevel = parseInt(classParts[0]) || parseInt(classParts[classParts.length - 1]);
          const classObj = classMap.get(`${className.toLowerCase()}-${gradeLevel}`);

          if (!classObj) {
            result.errors++;
            continue;
          }

          // Generate admission number
          const admissionNumber = `STU-${currentYear}-${String(nextAdmissionNum).padStart(4, '0')}`;
          nextAdmissionNum++;

          // Generate student login
          const studentLogin = await generateUniqueLogin(
            school?.name ?? "school",
            tx,
            usedLogins
          );

          // Generate temporary password
          const temporaryPassword = commonPassword || "Student@123";
          const passwordHash = await bcrypt.hash(temporaryPassword, 10);

          // Create user account for student
          const user = await tx.user.create({
            data: {
              username: studentLogin,
              email: studentLogin,
              passwordHash,
              role: 'STUDENT',
              schoolId
            }
          });

          // Handle parent
          let parentId;
          if (parentMap.has(parentMobile)) {
            // Use existing parent
            parentId = parentMap.get(parentMobile);
            result.existingParentsReused++;
          } else {
            // Create new parent
            const parentNameParts = parentName.split(' ');
            const parentFirstName = parentNameParts[0] || '';
            const parentLastName = parentNameParts.slice(1).join('') || '';
            const parentLogin = parentMobile; // Parents use mobile as login
            const parentPassword = commonPassword || "Student@123";
            const parentPasswordHash = await bcrypt.hash(parentPassword, 10);

            const parentUser = await tx.user.create({
              data: {
                username: parentLogin,
                email: parentEmail || `${parentLogin}@temp.com`,
                passwordHash: parentPasswordHash,
                role: 'PARENT',
                schoolId
              }
            });

            const parent = await tx.parent.create({
              data: {
                id: parentUser.id,
                username: parentLogin,
                name: parentFirstName,
                surname: parentLastName,
                email: parentEmail || null,
                phone: parentMobile,
                address,
                schoolId,
              }
            });

            parentId = parent.id;
            parentMap.set(parentMobile, parentId);
            result.parentsCreated++;

            // Store parent credentials
            result.parentCredentials.push({
              parentName,
              mobileNumber: parentMobile,
              temporaryPassword: parentPassword,
              linkedChildren: []
            });
          }

          // Create student
          const student = await tx.student.create({
            data: {
              id: user.id,
              username: studentLogin,
              name: firstName,
              surname: lastName,
              email: studentLogin,
              phone: null,
              address,
              img: null,
              bloodType: 'O+',
              sex: gender,
              birthday: dob,
              classId: classObj.id,
              gradeId: classObj.gradeId,
              section,
              schoolId,
              admissionNumber,
              rollNumber: String(nextAdmissionNum - 1),
              parentId,
            }
          });

          result.studentsCreated++;

          // Store student credentials
          result.studentCredentials.push({
            studentName: `${firstName} ${lastName}`,
            admissionNumber,
            class: className,
            section,
            login: studentLogin,
            temporaryPassword
          });

          // Link parent-child if not already linked
          const existingLink = await tx.parentStudent.findFirst({
            where: {
              parentId,
              studentId: student.id
            }
          });

          if (!existingLink && parentId) {
            await tx.parentStudent.create({
              data: {
                parentId: parentId,
                studentId: student.id,
                relationshipType: 'GUARDIAN',
                isPrimary: true
              }
            });
          }

          // Update parent credentials with child info
          const parentCred = result.parentCredentials.find(p => p.mobileNumber === parentMobile);
          if (parentCred) {
            parentCred.linkedChildren.push(`${firstName} ${lastName} (${className}-${section})`);
          }

        } catch (error) {
          console.error(`Error processing row ${rowIndex}:`, error);
          result.errors++;
        }
      }
    });

    return NextResponse.json({
      success: true,
      ...result,
      message: `Successfully imported ${result.studentsCreated} students`
    });

  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { error: "Failed to complete import transaction", details: error },
      { status: 500 }
    );
  }
}

async function generateUniqueLogin(
  schoolName: string,
  tx: any,
  usedLogins: Set<string>
): Promise<string> {
  const cleanSchool = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '');
  let counter = 1001;

  while (true) {
    const login = `${cleanSchool}_${counter}@gmail.com`;
    if (!usedLogins.has(login)) {
      const existing = await tx.user.findUnique({
        where: { username: login }
      });
      
      if (!existing) {
        usedLogins.add(login);
        return login;
      }
    }
    counter++;
  }
}

function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile.replace(/[^0-9]/g, ''));
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}