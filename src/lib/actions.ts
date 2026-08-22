"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { assignFeeSchema, AssignFeeSchema, BulkStudentSchema, bulkAttendanceSchema, bulkResultSchema, ClassSchema, disciplineSchema, ExamSchema, feeStructureSchema, FeeStructureSchema, LessonSchema, ParentSchema, ResultSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";
import { getSession, isTeacherRole, requireSession } from "./getRole";
import { logAudit } from "./audit";

type CurrentState = { success: boolean; error: boolean; message?: string; data?: unknown };

import crypto from "crypto";

function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const randomBytes = crypto.randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
}

// ─── SUBJECT ──────────────────────────────────────────────────────────────────

export const createSubject = async (
  currentState: CurrentState, data: SubjectSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    await prisma.subject.create({
      data: {
        name:     data.name,
        schoolId: session.schoolId,
        teachers: { connect: data.teachers.map((id) => ({ id })) },
      },
    });
    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createSubject]", err);
    return { success: false, error: true, message: "Failed to create subject." };
  }
};

export const updateSubject = async (
  currentState: CurrentState, data: SubjectSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.subject.findUnique({ where: { id: data.id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Subject not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name:     data.name,
        teachers: { set: data.teachers.map((id) => ({ id })) },
      },
    });
    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateSubject]", err);
    return { success: false, error: true, message: "Failed to update subject." };
  }
};

export const deleteSubject = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.subject.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Subject not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.subject.delete({ where: { id } });
    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteSubject]", err);
    return { success: false, error: true, message: "Failed to delete subject." };
  }
};

// ─── CLASS ────────────────────────────────────────────────────────────────────

export const createClass = async (
  currentState: CurrentState, data: ClassSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    await prisma.class.create({ data: { ...data, schoolId: session.schoolId } });
    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createClass]", err);
    return { success: false, error: true, message: "Failed to create class." };
  }
};

export const updateClass = async (
  currentState: CurrentState, data: ClassSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.class.findUnique({ where: { id: data.id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Class not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.class.update({ where: { id: data.id }, data });
    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateClass]", err);
    return { success: false, error: true, message: "Failed to update class." };
  }
};

export const deleteClass = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.class.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Class not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.class.delete({ where: { id } });
    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteClass]", err);
    return { success: false, error: true, message: "Failed to delete class." };
  }
};

// ─── TEACHER ─────────────────────────────────────────────────────────────────

export const createTeacher = async (
  currentState: CurrentState, data: TeacherSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    if (!data.password) return { success: false, error: true, message: "Password is required." };
    const passwordHash = await bcrypt.hash(data.password, 12);
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          email: data.email || `${data.username}@school.local`,
          passwordHash,
          role: "teacher",
          schoolId: session.schoolId!,
        },
      });
      await tx.teacher.create({
        data: {
          id: user.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address,
          img: data.img || null,
          bloodType: data.bloodType,
          sex: data.sex,
          birthday: data.birthday,
          schoolId: session.schoolId!,
          subjects: { connect: data.subjects?.map((id) => ({ id: parseInt(id) })) ?? [] },
        },
      });
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createTeacher]", err);
    return { success: false, error: true, message: "Failed to create teacher." };
  }
};

export const updateTeacher = async (
  currentState: CurrentState, data: TeacherSchema,
): Promise<CurrentState> => {
  if (!data.id) return { success: false, error: true, message: "Missing teacher ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.teacher.findUnique({ where: { id: data.id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Teacher not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      if (data.password) {
        const passwordHash = await bcrypt.hash(data.password, 12);
        await tx.user.update({ where: { id: data.id }, data: { username: data.username, passwordHash } });
      } else {
        await tx.user.update({ where: { id: data.id }, data: { username: data.username } });
      }
      await tx.teacher.update({
        where: { id: data.id },
        data: {
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address,
          img: data.img || null,
          bloodType: data.bloodType,
          sex: data.sex,
          birthday: data.birthday,
          subjects: { set: data.subjects?.map((id) => ({ id: parseInt(id) })) ?? [] },
        },
      });
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateTeacher]", err);
    return { success: false, error: true, message: "Failed to update teacher." };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.teacher.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Teacher not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    // First unlink dependent records to avoid FK violations
    await prisma.$transaction(async (tx) => {
      // Unlink lessons (set teacher's lessons to be deleted or kept — we delete them)
      await tx.attendance.deleteMany({ where: { lesson: { teacherId: id } } });
      await tx.assignment.deleteMany({ where: { lesson: { teacherId: id } } });
      await tx.exam.deleteMany({ where: { lesson: { teacherId: id } } });
      await tx.lesson.deleteMany({ where: { teacherId: id } });
      // Unlink class supervisors
      await tx.class.updateMany({ where: { supervisorId: id }, data: { supervisorId: null } });
      // Remove subject connections
      await tx.teacher.update({ where: { id }, data: { subjects: { set: [] } } });
      // Delete teacher profile then user
      await tx.teacher.delete({ where: { id } });
      await tx.user.delete({ where: { id } });
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteTeacher]", err);
    return { success: false, error: true, message: "Failed to delete teacher." };
  }
};

// ─── STUDENT ─────────────────────────────────────────────────────────────────

async function getNextStudentNumber(schoolId: string, schoolNamePrefix: string): Promise<number> {
  const prefix = (schoolNamePrefix || "school").toLowerCase().replace(/[^a-z0-9]/g, "");
  const students = await prisma.student.findMany({
    where: { schoolId },
    select: { username: true, email: true },
  });

  let maxNum = 1000;
  for (const st of students) {
    const text = `${st.username || ""} ${st.email || ""}`;
    const matches = Array.from(text.matchAll(/_(\d+)(?:@|$|\.)/g));
    for (const match of matches) {
      if (match[1]) {
        const num = parseInt(match[1]);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    }
  }
  return maxNum + 1;
}

async function resolveParent(
  schoolId: string,
  data: {
    parentId?: string;
    parentMode?: "existing" | "new";
    newParentName?: string;
    newParentSurname?: string;
    newParentPhone?: string;
    newParentPassword?: string;
    defaultPassword?: string;
  }
): Promise<{ parentId: string } | { error: string }> {
  if (data.parentMode === "new" || data.newParentPhone?.trim()) {
    const phone = (data.newParentPhone || "").trim();
    if (!phone) return { error: "Parent phone number is required for parent creation." };

    const existingParent = await prisma.parent.findUnique({ where: { phone } });
    if (existingParent) {
      return { parentId: existingParent.id };
    }

    const name = (data.newParentName || "Parent").trim();
    const surname = (data.newParentSurname || "").trim() || "Guardian";
    const password = data.newParentPassword || data.defaultPassword || "Student@123";
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: phone, // Parent logs in with their phone number & password
        email: `${phone}@parent.local`,
        passwordHash,
        role: "PARENT",
        schoolId,
      },
    });

    const parent = await prisma.parent.create({
      data: {
        id: user.id,
        username: phone,
        name,
        surname,
        phone,
        address: "School Campus",
        schoolId,
      },
    });

    return { parentId: parent.id };
  }

  const targetParentId = (data.parentId || "").trim();
  if (targetParentId) {
    const existing = await prisma.parent.findUnique({ where: { id: targetParentId } });
    if (existing) return { parentId: existing.id };
  }

  const defaultParent = await prisma.parent.findFirst({ where: { schoolId } });
  if (defaultParent) return { parentId: defaultParent.id };

  return { error: "Parent assignment is mandatory. Please select or create a parent." };
}

export const createStudent = async (
  currentState: CurrentState, data: StudentSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };

    const cls = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } }, grade: true },
    });
    if (cls && cls._count.students >= cls.capacity) {
      return { success: false, error: true, message: "Class is at full capacity." };
    }

    // Get school configuration
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { name: true, studentLoginDomain: true }
    });

    const studentDomain = school?.studentLoginDomain || 'school.edu';

    // Generate admission number
    const lastAdmission = await prisma.student.findFirst({
      where: { schoolId: session.schoolId },
      orderBy: { admissionNumber: 'desc' },
      select: { admissionNumber: true }
    });

    let nextAdmissionNum = 1;
    const currentYear = new Date().getFullYear();
    if (lastAdmission?.admissionNumber) {
      const match = lastAdmission.admissionNumber.match(/\d+$/);
      if (match) {
        nextAdmissionNum = parseInt(match[0]) + 1;
      }
    }

    const admissionNumber = `STU-${currentYear}-${String(nextAdmissionNum).padStart(4, '0')}`;

    // Generate student login: schoolname_1001@gmail.com
    const schoolName = school?.name || data.schoolName || "school";
    const cleanSchool = schoolName.toLowerCase().replace(/[^a-z0-9]/g, "");
    let studentLogin = "";
    let loginCounter = 1001;

    while (true) {
      studentLogin = `${cleanSchool}_${loginCounter}@gmail.com`;
      const existing = await prisma.user.findUnique({
        where: { username: studentLogin }
      });
      
      if (!existing) break;
      loginCounter++;
    }

    // Generate temporary password
    const temporaryPassword = data.password || "Student@123";
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    // Resolve parent assignment (mandatory)
    const parentRes = await resolveParent(session.schoolId, {
      ...data,
      defaultPassword: temporaryPassword
    });
    if ("error" in parentRes) {
      return { success: false, error: true, message: parentRes.error };
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: studentLogin,
          email: studentLogin,
          passwordHash,
          role: "STUDENT",
          schoolId: session.schoolId!,
        },
      });
      await tx.student.create({
        data: {
          id: user.id,
          username: studentLogin,
          name: data.name,
          surname: data.surname,
          email: studentLogin,
          phone: data.phone || null,
          address: data.address || `Class ${cls?.name || ""}`,
          img: data.img || null,
          bloodType: data.bloodType || "A+",
          sex: data.sex,
          birthday: data.birthday || new Date(),
          gradeId: data.gradeId,
          classId: data.classId,
          parentId: parentRes.parentId,
          schoolId: session.schoolId!,
          admissionNumber,
          rollNumber: String(nextAdmissionNum),
        },
      });
    });
    revalidatePath("/list/students");
    return { 
      success: true, 
      error: false, 
      message: `Student created successfully. Login: ${studentLogin}, Password: ${temporaryPassword}` 
    };
  } catch (err: any) {
    console.error("[createStudent]", err);
    if (err?.code === "P2002") {
      const targets = (err?.meta?.target as string[]) || [];
      if (targets.includes("username")) return { success: false, error: true, message: "Username/Unique ID is already taken." };
      if (targets.includes("email")) return { success: false, error: true, message: "Email is already registered." };
      if (targets.includes("phone")) return { success: false, error: true, message: "Phone number is already registered." };
      return { success: false, error: true, message: "A student or user with this info already exists." };
    }
    return { success: false, error: true, message: err?.message || "Failed to create student." };
  }
};

export const createMultipleStudents = async (
  currentState: CurrentState, data: BulkStudentSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };

    if (!data.students || data.students.length === 0) {
      return { success: false, error: true, message: "No students provided for bulk creation." };
    }

    const cls = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });
    if (!cls) return { success: false, error: true, message: "Selected class does not exist." };

    const remainingCapacity = cls.capacity - cls._count.students;
    if (data.students.length > remainingCapacity) {
      return {
        success: false,
        error: true,
        message: `Class capacity limit reached. Remaining spots: ${remainingCapacity}, attempted: ${data.students.length}.`,
      };
    }

    // Resolve parent assignment (mandatory)
    const parentRes = await resolveParent(session.schoolId, data);
    if ("error" in parentRes) {
      return { success: false, error: true, message: parentRes.error };
    }

    // Auto-fetch school name and login domain — no manual input needed
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { name: true, studentLoginDomain: true },
    });
    const studentDomain = school?.studentLoginDomain || "school.edu";

    // Determine next admission number from existing students
    const lastAdmission = await prisma.student.findFirst({
      where: { schoolId: session.schoolId },
      orderBy: { admissionNumber: "desc" },
      select: { admissionNumber: true },
    });
    let nextAdmissionNum = 1;
    const currentYear = new Date().getFullYear();
    if (lastAdmission?.admissionNumber) {
      const match = lastAdmission.admissionNumber.match(/\d+$/);
      if (match) nextAdmissionNum = parseInt(match[0]) + 1;
    }

    const now = new Date();
    let createdCount = 0;
    const credentialsList: Array<{ name: string; login: string; password: string; admissionNumber: string }> = [];
    const cleanSchool = (school?.name || "school").toLowerCase().replace(/[^a-z0-9]/g, "");
    const usedLogins = new Set<string>();

    await prisma.$transaction(async (tx) => {
      let loginCounter = 1001;
      for (const st of data.students) {
        // Generate admission number: STU-{YEAR}-{NNNN}
        const admissionNumber = `STU-${currentYear}-${String(nextAdmissionNum).padStart(4, "0")}`;
        nextAdmissionNum++;

        // Generate unique login: schoolname_1001@gmail.com
        let studentLogin = "";
        while (true) {
          studentLogin = `${cleanSchool}_${loginCounter}@gmail.com`;
          if (!usedLogins.has(studentLogin)) {
            const existing = await tx.user.findUnique({ where: { username: studentLogin } });
            if (!existing) {
              usedLogins.add(studentLogin);
              break;
            }
          }
          loginCounter++;
        }

        // If a common password is provided, use that; otherwise use default common password
        const temporaryPassword = data.defaultPassword || "Student@123";
        const passwordHash = await bcrypt.hash(temporaryPassword, 12);

        const user = await tx.user.create({
          data: {
            username: studentLogin,
            email: studentLogin,
            passwordHash,
            role: "STUDENT",
            schoolId: session.schoolId!,
          },
        });

        await tx.student.create({
          data: {
            id: user.id,
            username: studentLogin,
            name: st.name,
            surname: st.surname,
            email: studentLogin,
            phone: st.phone || null,
            address: cls.name ? `Class ${cls.name}` : "School Address",
            bloodType: "A+",
            sex: st.sex || "MALE",
            birthday: now,
            gradeId: data.gradeId,
            classId: data.classId,
            parentId: parentRes.parentId,
            schoolId: session.schoolId!,
            admissionNumber,
            rollNumber: String(nextAdmissionNum - 1),
          },
        });

        credentialsList.push({
          name: `${st.name} ${st.surname}`,
          login: studentLogin,
          password: temporaryPassword,
          admissionNumber,
        });
        createdCount++;
      }
    });

    revalidatePath("/list/students");

    // Build a readable credentials summary to show in the toast
    const credsSummary = credentialsList
      .map((c) => `${c.name} → Login: ${c.login}  Password: ${c.password}  (${c.admissionNumber})`)
      .join("\n");

    return {
      success: true,
      error: false,
      message: `Successfully added ${createdCount} students to Class ${cls.name}.\n\nCredentials:\n${credsSummary}`,
      data: credentialsList,
    };
  } catch (err: any) {
    console.error("[createMultipleStudents]", err);
    if (err?.code === "P2002") {
      return {
        success: false,
        error: true,
        message: "Failed due to duplicate username, email, or phone number in the list.",
      };
    }
    return { success: false, error: true, message: err?.message || "Failed to bulk add students." };
  }
};

export const updateStudent = async (
  currentState: CurrentState, data: StudentSchema,
): Promise<CurrentState> => {
  if (!data.id) return { success: false, error: true, message: "Missing student ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existingStudent = await prisma.student.findUnique({ where: { id: data.id }, select: { schoolId: true, parentId: true } });
    if (!existingStudent) return { success: false, error: true, message: "Student not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existingStudent.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    let targetParentId = data.parentId?.trim();
    if (targetParentId) {
      const parentExists = await prisma.parent.findUnique({ where: { id: targetParentId } });
      if (!parentExists) {
        targetParentId = existingStudent?.parentId ?? undefined;
      }
    }
    await prisma.$transaction(async (tx) => {
      if (data.password) {
        const passwordHash = await bcrypt.hash(data.password, 12);
        await tx.user.update({ where: { id: data.id }, data: { username: data.username, passwordHash } });
      } else {
        await tx.user.update({ where: { id: data.id }, data: { username: data.username } });
      }
      await tx.student.update({
        where: { id: data.id },
        data: {
          username: data.username, name: data.name, surname: data.surname,
          email: data.email || null, phone: data.phone || null, address: data.address,
          img: data.img || null, bloodType: data.bloodType, sex: data.sex,
          birthday: data.birthday, gradeId: data.gradeId, classId: data.classId,
          ...(targetParentId ? { parentId: targetParentId } : {}),
        },
      });
    });
    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("[updateStudent]", err);
    if (err?.code === "P2002") {
      return { success: false, error: true, message: "Username, email, or phone is already taken by another account." };
    }
    return { success: false, error: true, message: err?.message || "Failed to update student." };
  }
};

export const deleteStudent = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.student.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Student not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      // Delete child records that don't cascade automatically
      await tx.attendance.deleteMany({ where: { studentId: id } });
      await tx.result.deleteMany({ where: { studentId: id } });
      await tx.discipline.deleteMany({ where: { studentId: id } });
      
      // Delete payments and invoices associated with student fees because Payment onDelete: NoAction
      await tx.payment.deleteMany({
        where: {
          studentFee: {
            studentId: id
          }
        }
      });
      await tx.invoice.deleteMany({
        where: {
          studentFee: {
            studentId: id
          }
        }
      });
      await tx.studentFee.deleteMany({
        where: {
          studentId: id
        }
      });

      // Finally delete the student and user records
      await tx.student.delete({ where: { id } });
      await tx.user.delete({ where: { id } });
    });
    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteStudent]", err);
    return { success: false, error: true, message: "Failed to delete student." };
  }
};

// ─── PARENT ───────────────────────────────────────────────────────────────────

export const createParent = async (
  currentState: CurrentState, data: ParentSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    if (!data.password) return { success: false, error: true, message: "Password is required." };
    const passwordHash = await bcrypt.hash(data.password, 12);
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          email: data.email || `${data.username}@school.local`,
          passwordHash,
          role: "student", // parents use "student" role for JWT (no parent role in enum)
          schoolId: session.schoolId!,
        },
      });
      await tx.parent.create({
        data: {
          id: user.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email || null,
          phone: data.phone,
          address: data.address,
          schoolId: session.schoolId!,
        },
      });
    });
    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createParent]", err);
    return { success: false, error: true, message: "Failed to create parent." };
  }
};

export const updateParent = async (
  currentState: CurrentState, data: ParentSchema,
): Promise<CurrentState> => {
  if (!data.id) return { success: false, error: true, message: "Missing parent ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.parent.findUnique({ where: { id: data.id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Parent not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      if (data.password) {
        const passwordHash = await bcrypt.hash(data.password, 12);
        await tx.user.update({ where: { id: data.id }, data: { username: data.username, passwordHash } });
      } else {
        await tx.user.update({ where: { id: data.id }, data: { username: data.username } });
      }
      await tx.parent.update({
        where: { id: data.id },
        data: {
          username: data.username, name: data.name, surname: data.surname,
          email: data.email || null, phone: data.phone, address: data.address,
        },
      });
    });
    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateParent]", err);
    return { success: false, error: true, message: "Failed to update parent." };
  }
};

export const deleteParent = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.parent.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Parent not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      await tx.parent.delete({ where: { id } });
      await tx.user.delete({ where: { id } });
    });
    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteParent]", err);
    return { success: false, error: true, message: "Failed to delete parent." };
  }
};

// ─── LESSON ───────────────────────────────────────────────────────────────────

export const createLesson = async (
  currentState: CurrentState, data: LessonSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    await prisma.lesson.create({
      data: {
        name: data.name, day: data.day,
        startTime: data.startTime, endTime: data.endTime,
        subjectId: data.subjectId, classId: data.classId,
        teacherId: data.teacherId, schoolId: session.schoolId,
      },
    });
    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createLesson]", err);
    return { success: false, error: true, message: "Failed to create lesson." };
  }
};

export const updateLesson = async (
  currentState: CurrentState, data: LessonSchema,
): Promise<CurrentState> => {
  if (!data.id) return { success: false, error: true, message: "Missing lesson ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.lesson.findUnique({ where: { id: data.id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Lesson not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name, day: data.day,
        startTime: data.startTime, endTime: data.endTime,
        subjectId: data.subjectId, classId: data.classId,
        teacherId: data.teacherId,
      },
    });
    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateLesson]", err);
    return { success: false, error: true, message: "Failed to update lesson." };
  }
};

export const deleteLesson = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.lesson.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Lesson not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { lessonId: id } });
      await tx.assignment.deleteMany({ where: { lessonId: id } });
      await tx.exam.deleteMany({ where: { lessonId: id } });
      await tx.lesson.delete({ where: { id } });
    });
    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteLesson]", err);
    return { success: false, error: true, message: "Failed to delete lesson." };
  }
};

// ─── EXAM ─────────────────────────────────────────────────────────────────────

export const createExam = async (
  currentState: CurrentState, data: ExamSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };

    let targetLessonId = data.lessonId;
    const subjectText = data.subjectName?.trim() || data.title;
    const schoolId = session.schoolId;

    if (!targetLessonId && data.classId) {
      const [existingSubject, existingTeacher] = await Promise.all([
        prisma.subject.findFirst({
          where: { name: { equals: subjectText, mode: "insensitive" }, schoolId },
          select: { id: true },
        }),
        prisma.teacher.findFirst({
          where: { schoolId },
          select: { id: true },
        }),
      ]);

      const subjectId = existingSubject
        ? existingSubject.id
        : (await prisma.subject.create({ data: { name: subjectText, schoolId }, select: { id: true } })).id;

      let lesson = await prisma.lesson.findFirst({
        where: { classId: data.classId, subjectId, schoolId },
        select: { id: true },
      });

      if (!lesson) {
        lesson = await prisma.lesson.create({
          data: {
            name: subjectText,
            day: "MONDAY",
            startTime: data.startTime,
            endTime: data.endTime,
            subjectId,
            classId: data.classId,
            teacherId: existingTeacher?.id || session.userId || "",
            schoolId,
          },
          select: { id: true },
        });
      }
      targetLessonId = lesson.id;
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: targetLessonId || null,
        lessonName: subjectText,
        schoolId,
        teacherId: session.userId || "",
        ...(data.maxMarks ? { maxMarks: data.maxMarks } : {}),
        ...(data.passingMarks !== undefined ? { passingMarks: data.passingMarks } : {}),
        ...(data.instructions ? { instructions: data.instructions } : {}),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createExam]", err);
    return { success: false, error: true, message: "Failed to create exam." };
  }
};

export const updateExam = async (
  currentState: CurrentState, data: ExamSchema,
): Promise<CurrentState> => {
  if (!data.id) return { success: false, error: true, message: "Missing exam ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.exam.findUnique({ where: { id: data.id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Exam not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    let targetLessonId = data.lessonId;
    const subjectText = data.subjectName?.trim() || data.title;
    const schoolId = session.schoolId || existing.schoolId;

    if (!targetLessonId && data.classId && schoolId) {
      const [existingSubject, existingTeacher] = await Promise.all([
        prisma.subject.findFirst({
          where: { name: { equals: subjectText, mode: "insensitive" }, schoolId },
          select: { id: true },
        }),
        prisma.teacher.findFirst({
          where: { schoolId },
          select: { id: true },
        }),
      ]);

      const subjectId = existingSubject
        ? existingSubject.id
        : (await prisma.subject.create({ data: { name: subjectText, schoolId }, select: { id: true } })).id;

      let lesson = await prisma.lesson.findFirst({
        where: { classId: data.classId, subjectId, schoolId },
        select: { id: true },
      });

      if (!lesson) {
        lesson = await prisma.lesson.create({
          data: {
            name: subjectText,
            day: "MONDAY",
            startTime: data.startTime,
            endTime: data.endTime,
            subjectId,
            classId: data.classId,
            teacherId: existingTeacher?.id || session.userId || "",
            schoolId,
          },
          select: { id: true },
        });
      }
      targetLessonId = lesson.id;
    }

    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        ...(targetLessonId ? { lessonId: targetLessonId } : {}),
        ...(data.subjectName ? { lessonName: data.subjectName } : {}),
        ...(data.maxMarks ? { maxMarks: data.maxMarks } : {}),
        ...(data.passingMarks !== undefined ? { passingMarks: data.passingMarks } : {}),
        ...(data.instructions ? { instructions: data.instructions } : {}),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateExam]", err);
    return { success: false, error: true, message: "Failed to update exam." };
  }
};

export const deleteExam = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.exam.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Exam not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      await tx.result.deleteMany({ where: { examId: id } });
      await tx.exam.delete({ where: { id } });
    });
    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteExam]", err);
    return { success: false, error: true, message: "Failed to delete exam." };
  }
};

// ─── ASSIGNMENT ───────────────────────────────────────────────────────────────

export const createAssignment = async (
  currentState: CurrentState, dataOrFormData: any,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };

    const isFd = dataOrFormData instanceof FormData;
    const title = isFd ? (dataOrFormData.get("title") as string) : dataOrFormData.title;
    const startDateStr = isFd ? (dataOrFormData.get("startDate") as string) : dataOrFormData.startDate;
    const dueDateStr = isFd ? (dataOrFormData.get("dueDate") as string) : dataOrFormData.dueDate;
    const rawLessonId = isFd ? dataOrFormData.get("lessonId") : dataOrFormData.lessonId;
    const rawClassId = isFd ? dataOrFormData.get("classId") : dataOrFormData.classId;
    const subjectName = isFd ? (dataOrFormData.get("subjectName") as string) : dataOrFormData.subjectName;
    const maxMarks = isFd ? dataOrFormData.get("maxMarks") : dataOrFormData.maxMarks;
    const instructions = isFd ? (dataOrFormData.get("instructions") as string) : dataOrFormData.instructions;

    let targetLessonId = rawLessonId ? parseInt(rawLessonId.toString()) : undefined;
    const classId = rawClassId ? parseInt(rawClassId.toString()) : undefined;
    const subjectText = subjectName?.trim() || title;
    const schoolId = session.schoolId;

    if (!targetLessonId && classId) {
      const [existingSubject, existingTeacher] = await Promise.all([
        prisma.subject.findFirst({
          where: { name: { equals: subjectText, mode: "insensitive" }, schoolId },
          select: { id: true },
        }),
        prisma.teacher.findFirst({
          where: { schoolId },
          select: { id: true },
        }),
      ]);

      const subjectId = existingSubject
        ? existingSubject.id
        : (await prisma.subject.create({ data: { name: subjectText, schoolId }, select: { id: true } })).id;

      let lesson = await prisma.lesson.findFirst({
        where: { classId, subjectId, schoolId },
        select: { id: true },
      });

      if (!lesson) {
        lesson = await prisma.lesson.create({
          data: {
            name: subjectText,
            day: "MONDAY",
            startTime: new Date(startDateStr),
            endTime: new Date(dueDateStr),
            subjectId,
            classId,
            teacherId: existingTeacher?.id || session.userId || "",
            schoolId,
          },
          select: { id: true },
        });
      }
      targetLessonId = lesson.id;
    }

    await prisma.assignment.create({
      data: {
        title,
        startDate: new Date(startDateStr),
        dueDate: new Date(dueDateStr),
        lessonId: targetLessonId || null,
        lessonName: subjectText,
        schoolId,
        teacherId: session.userId || "",
        ...(maxMarks ? { maxMarks: parseInt(maxMarks.toString()) } : {}),
        ...(instructions ? { instructions } : {}),
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createAssignment]", err);
    return { success: false, error: true, message: "Failed to create assignment." };
  }
};

export const updateAssignment = async (
  currentState: CurrentState, dataOrFormData: any,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const isFd = dataOrFormData instanceof FormData;
    const id = parseInt(isFd ? (dataOrFormData.get("id") as string) : dataOrFormData.id);
    if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };

    const existing = await prisma.assignment.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Assignment not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    const title = isFd ? (dataOrFormData.get("title") as string) : dataOrFormData.title;
    const startDateStr = isFd ? (dataOrFormData.get("startDate") as string) : dataOrFormData.startDate;
    const dueDateStr = isFd ? (dataOrFormData.get("dueDate") as string) : dataOrFormData.dueDate;
    const rawLessonId = isFd ? dataOrFormData.get("lessonId") : dataOrFormData.lessonId;
    const rawClassId = isFd ? dataOrFormData.get("classId") : dataOrFormData.classId;
    const subjectName = isFd ? (dataOrFormData.get("subjectName") as string) : dataOrFormData.subjectName;
    const maxMarks = isFd ? dataOrFormData.get("maxMarks") : dataOrFormData.maxMarks;
    const instructions = isFd ? (dataOrFormData.get("instructions") as string) : dataOrFormData.instructions;

    let targetLessonId = rawLessonId ? parseInt(rawLessonId.toString()) : undefined;
    const classId = rawClassId ? parseInt(rawClassId.toString()) : undefined;
    const subjectText = subjectName?.trim() || title;
    const schoolId = session.schoolId || existing.schoolId;

    if (!targetLessonId && classId && schoolId) {
      const [existingSubject, existingTeacher] = await Promise.all([
        prisma.subject.findFirst({
          where: { name: { equals: subjectText, mode: "insensitive" }, schoolId },
          select: { id: true },
        }),
        prisma.teacher.findFirst({
          where: { schoolId },
          select: { id: true },
        }),
      ]);

      const subjectId = existingSubject
        ? existingSubject.id
        : (await prisma.subject.create({ data: { name: subjectText, schoolId }, select: { id: true } })).id;

      let lesson = await prisma.lesson.findFirst({
        where: { classId, subjectId, schoolId },
        select: { id: true },
      });

      if (!lesson) {
        lesson = await prisma.lesson.create({
          data: {
            name: subjectText,
            day: "MONDAY",
            startTime: new Date(startDateStr),
            endTime: new Date(dueDateStr),
            subjectId,
            classId,
            teacherId: existingTeacher?.id || session.userId || "",
            schoolId,
          },
          select: { id: true },
        });
      }
      targetLessonId = lesson.id;
    }

    await prisma.assignment.update({
      where: { id },
      data: {
        title,
        startDate: new Date(startDateStr),
        dueDate: new Date(dueDateStr),
        ...(targetLessonId ? { lessonId: targetLessonId } : {}),
        ...(subjectText ? { lessonName: subjectText } : {}),
        ...(maxMarks ? { maxMarks: parseInt(maxMarks.toString()) } : {}),
        ...(instructions ? { instructions } : {}),
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateAssignment]", err);
    return { success: false, error: true, message: "Failed to update assignment." };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.assignment.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Assignment not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }
    await prisma.$transaction(async (tx) => {
      await tx.result.deleteMany({ where: { assignmentId: id } });
      await tx.assignment.delete({ where: { id } });
    });
    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteAssignment]", err);
    return { success: false, error: true, message: "Failed to delete assignment." };
  }
};

// ─── RESULT ───────────────────────────────────────────────────────────────────

export const createResult = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    const examId       = formData.get("examId")       ? parseInt(formData.get("examId") as string)       : null;
    const assignmentId = formData.get("assignmentId") ? parseInt(formData.get("assignmentId") as string) : null;
    if (!examId && !assignmentId) return { success: false, error: true, message: "Select an exam or assignment." };
    await prisma.result.create({
      data: {
        score:        parseInt(formData.get("score") as string),
        studentId:    formData.get("studentId") as string,
        examId,
        assignmentId,
        schoolId:     session.schoolId,
      },
    });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createResult]", err);
    return { success: false, error: true, message: "Failed to create result." };
  }
};

export const updateResult = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.result.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Result not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.result.update({
      where: { id },
      data: { score: parseInt(formData.get("score") as string) },
    });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateResult]", err);
    return { success: false, error: true, message: "Failed to update result." };
  }
};

export const bulkUploadSectionResults = async (
  currentState: CurrentState,
  formData: FormData
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }

    const examIdStr = formData.get("examId") as string;
    const assignmentIdStr = formData.get("assignmentId") as string;
    const studentIds = formData.getAll("studentId") as string[];
    const scores = formData.getAll("score") as string[];

    const examId = examIdStr ? parseInt(examIdStr) : null;
    const assignmentId = assignmentIdStr ? parseInt(assignmentIdStr) : null;

    if (!examId && !assignmentId) {
      return { success: false, error: true, message: "Select an exam or assignment." };
    }

    const schoolId = session.schoolId;

    for (let i = 0; i < studentIds.length; i++) {
      const studentId = studentIds[i];
      const scoreRaw = scores[i];
      if (scoreRaw === "" || scoreRaw === undefined) continue;

      const score = Math.max(0, Math.min(100, parseInt(scoreRaw)));

      const existing = await prisma.result.findFirst({
        where: {
          studentId,
          ...(examId ? { examId } : { assignmentId }),
          ...(schoolId ? { schoolId } : {}),
        },
        select: { id: true },
      });

      if (existing) {
        await prisma.result.update({
          where: { id: existing.id },
          data: { score },
        });
      } else {
        await prisma.result.create({
          data: {
            score,
            studentId,
            schoolId: schoolId || "",
            ...(examId ? { examId } : { assignmentId }),
          },
        });
      }
    }

    revalidatePath("/list/results");
    return { success: true, error: false, message: "Marks uploaded successfully!" };
  } catch (err) {
    console.error("[bulkUploadSectionResults]", err);
    return { success: false, error: true, message: "Failed to upload marks." };
  }
};

export const deleteResult = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.result.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Result not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.result.delete({ where: { id } });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteResult]", err);
    return { success: false, error: true, message: "Failed to delete result." };
  }
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────

export const createAttendance = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    await prisma.attendance.create({
      data: {
        studentId: formData.get("studentId") as string,
        lessonId:  parseInt(formData.get("lessonId") as string),
        date:      new Date(formData.get("date") as string),
        present:   formData.get("present") === "true",
        schoolId:  session.schoolId,
      },
    });
    revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createAttendance]", err);
    return { success: false, error: true, message: "Failed to record attendance." };
  }
};

export const updateAttendance = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.attendance.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Attendance record not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.attendance.update({
      where: { id },
      data: { present: formData.get("present") === "true", date: new Date(formData.get("date") as string) },
    });
    revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateAttendance]", err);
    return { success: false, error: true, message: "Failed to update attendance." };
  }
};

export const deleteAttendance = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.attendance.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Attendance record not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.attendance.delete({ where: { id } });
    revalidatePath("/list/attendance");
    revalidatePath("/teacher/classroom");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteAttendance]", err);
    return { success: false, error: true, message: "Failed to delete attendance." };
  }
};

// ─── BULK ATTENDANCE (teacher classroom) ──────────────────────────────────────

export const bulkMarkAttendance = async (
  currentState: CurrentState,
  data: import("./formValidationSchemas").BulkAttendanceSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId || !session.userId) {
      return { success: false, error: true, message: "Unauthorized" };
    }
    if (!isTeacherRole(session.role) && session.role !== "admin" && session.role !== "SCHOOL_ADMIN") {
      return { success: false, error: true, message: "Only teachers can mark class attendance." };
    }

    const parsed = bulkAttendanceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Invalid data." };
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: parsed.data.lessonId,
        schoolId: session.schoolId,
        ...(isTeacherRole(session.role) ? { teacherId: session.userId } : {}),
      },
      include: { class: { include: { students: { select: { id: true } } } } },
    });
    if (!lesson) return { success: false, error: true, message: "Lesson not found or access denied." };

    const classStudentIds = new Set(lesson.class.students.map((s) => s.id));
    const dateStart = new Date(parsed.data.date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(parsed.data.date);
    dateEnd.setHours(23, 59, 59, 999);

    let saved = 0;
    await prisma.$transaction(async (tx) => {
      for (const rec of parsed.data.records) {
        if (!classStudentIds.has(rec.studentId)) continue;
        const existing = await tx.attendance.findFirst({
          where: {
            studentId: rec.studentId,
            lessonId: parsed.data.lessonId,
            date: { gte: dateStart, lte: dateEnd },
          },
        });
        if (existing) {
          await tx.attendance.update({
            where: { id: existing.id },
            data: { present: rec.present },
          });
        } else {
          await tx.attendance.create({
            data: {
              studentId: rec.studentId,
              lessonId: parsed.data.lessonId,
              date: parsed.data.date,
              present: rec.present,
              schoolId: session.schoolId!,
            },
          });
        }
        saved++;
      }
    });

    revalidatePath("/list/attendance");
    revalidatePath("/teacher/classroom");
    return { success: true, error: false, message: `Attendance saved for ${saved} students.` };
  } catch (err) {
    console.error("[bulkMarkAttendance]", err);
    return { success: false, error: true, message: "Failed to save attendance." };
  }
};

// ─── BULK RESULTS (teacher classroom) ─────────────────────────────────────────

export const bulkUploadResults = async (
  currentState: CurrentState,
  data: import("./formValidationSchemas").BulkResultSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId || !session.userId) {
      return { success: false, error: true, message: "Unauthorized" };
    }
    if (!isTeacherRole(session.role) && session.role !== "admin" && session.role !== "SCHOOL_ADMIN") {
      return { success: false, error: true, message: "Only teachers can upload marks." };
    }

    const parsed = bulkResultSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Invalid data." };
    }
    if (!parsed.data.examId && !parsed.data.assignmentId) {
      return { success: false, error: true, message: "Select an exam or assignment." };
    }

    let classStudentIds: Set<string> | null = null;
    if (parsed.data.examId) {
      const exam = await prisma.exam.findFirst({
        where: {
          id: parsed.data.examId,
          schoolId: session.schoolId,
          ...(isTeacherRole(session.role) ? { lesson: { teacherId: session.userId } } : {}),
        },
        include: { lesson: { include: { class: { include: { students: { select: { id: true } } } } } } },
      });
      if (!exam) return { success: false, error: true, message: "Exam not found or access denied." };
      classStudentIds = new Set(exam.lesson?.class.students.map((s) => s.id) ?? []);
    } else if (parsed.data.assignmentId) {
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: parsed.data.assignmentId,
          schoolId: session.schoolId,
          ...(isTeacherRole(session.role) ? { lesson: { teacherId: session.userId } } : {}),
        },
        include: { lesson: { include: { class: { include: { students: { select: { id: true } } } } } } },
      });
      if (!assignment) return { success: false, error: true, message: "Assignment not found or access denied." };
      classStudentIds = new Set(assignment.lesson?.class.students.map((s) => s.id) ?? []);
    }

    let saved = 0;
    await prisma.$transaction(async (tx) => {
      for (const rec of parsed.data.records) {
        if (classStudentIds && !classStudentIds.has(rec.studentId)) continue;
        const existing = await tx.result.findFirst({
          where: {
            studentId: rec.studentId,
            ...(parsed.data.examId ? { examId: parsed.data.examId } : { assignmentId: parsed.data.assignmentId }),
          },
        });
        if (existing) {
          await tx.result.update({ where: { id: existing.id }, data: { score: rec.score } });
        } else {
          await tx.result.create({
            data: {
              score: rec.score,
              studentId: rec.studentId,
              examId: parsed.data.examId ?? null,
              assignmentId: parsed.data.assignmentId ?? null,
              schoolId: session.schoolId!,
            },
          });
        }
        saved++;
      }
    });

    revalidatePath("/list/results");
    revalidatePath("/teacher/classroom");
    return { success: true, error: false, message: `Marks saved for ${saved} students.` };
  } catch (err) {
    console.error("[bulkUploadResults]", err);
    return { success: false, error: true, message: "Failed to upload marks." };
  }
};

// ─── DISCIPLINE ───────────────────────────────────────────────────────────────

export const createDiscipline = async (
  currentState: CurrentState,
  data: import("./formValidationSchemas").DisciplineSchema,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId || !session.userId) {
      return { success: false, error: true, message: "Unauthorized" };
    }
    if (!isTeacherRole(session.role) && session.role !== "admin" && session.role !== "SCHOOL_ADMIN") {
      return { success: false, error: true, message: "Only teachers can add discipline records." };
    }

    const parsed = disciplineSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: true, message: parsed.error.errors[0]?.message ?? "Invalid data." };
    }

    const student = await prisma.student.findFirst({
      where: {
        id: parsed.data.studentId,
        schoolId: session.schoolId,
        ...(isTeacherRole(session.role)
          ? { class: { lessons: { some: { teacherId: session.userId } } } }
          : {}),
      },
    });
    if (!student) return { success: false, error: true, message: "Student not found or not in your classes." };

    await prisma.discipline.create({
      data: {
        date: parsed.data.date,
        type: parsed.data.type,
        description: parsed.data.description,
        studentId: parsed.data.studentId,
        teacherId: session.userId,
        schoolId: session.schoolId,
      },
    });

    revalidatePath("/teacher/classroom");
    return { success: true, error: false, message: "Discipline record added." };
  } catch (err) {
    console.error("[createDiscipline]", err);
    return { success: false, error: true, message: "Failed to add discipline record." };
  }
};

export const deleteDiscipline = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.userId) return { success: false, error: true, message: "Unauthorized" };

    const record = await prisma.discipline.findFirst({
      where: {
        id,
        ...(session.role !== "SUPER_ADMIN" && session.role !== "provider" && session.schoolId
          ? { schoolId: session.schoolId }
          : {}),
        ...(isTeacherRole(session.role) ? { teacherId: session.userId } : {}),
      },
    });
    if (!record) return { success: false, error: true, message: "Record not found or access denied." };

    await prisma.discipline.delete({ where: { id } });
    revalidatePath("/teacher/classroom");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteDiscipline]", err);
    return { success: false, error: true, message: "Failed to delete discipline record." };
  }
};

// ─── EVENT ────────────────────────────────────────────────────────────────────

export const createEvent = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    await prisma.event.create({
      data: {
        title:       formData.get("title") as string,
        description: formData.get("description") as string,
        startTime:   new Date(formData.get("startTime") as string),
        endTime:     new Date(formData.get("endTime") as string),
        classId:     formData.get("classId") ? parseInt(formData.get("classId") as string) : null,
        schoolId:    session.schoolId,
      },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createEvent]", err);
    return { success: false, error: true, message: "Failed to create event." };
  }
};

export const updateEvent = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.event.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Event not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.event.update({
      where: { id },
      data: {
        title:       formData.get("title") as string,
        description: formData.get("description") as string,
        startTime:   new Date(formData.get("startTime") as string),
        endTime:     new Date(formData.get("endTime") as string),
        classId:     formData.get("classId") ? parseInt(formData.get("classId") as string) : null,
      },
    });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateEvent]", err);
    return { success: false, error: true, message: "Failed to update event." };
  }
};

export const deleteEvent = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.event.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Event not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.event.delete({ where: { id } });
    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteEvent]", err);
    return { success: false, error: true, message: "Failed to delete event." };
  }
};

// ─── ANNOUNCEMENT ─────────────────────────────────────────────────────────────

export const createAnnouncement = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  try {
    const session = await getSession();
    if (!session?.schoolId) return { success: false, error: true, message: "Unauthorized" };
    await prisma.announcement.create({
      data: {
        title:       formData.get("title") as string,
        description: formData.get("description") as string,
        date:        new Date(formData.get("date") as string),
        classId:     formData.get("classId") ? parseInt(formData.get("classId") as string) : null,
        schoolId:    session.schoolId,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error("[createAnnouncement]", err);
    return { success: false, error: true, message: "Failed to create announcement." };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.announcement.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Announcement not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.announcement.update({
      where: { id },
      data: {
        title:       formData.get("title") as string,
        description: formData.get("description") as string,
        date:        new Date(formData.get("date") as string),
        classId:     formData.get("classId") ? parseInt(formData.get("classId") as string) : null,
      },
    });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error("[updateAnnouncement]", err);
    return { success: false, error: true, message: "Failed to update announcement." };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState, formData: FormData,
): Promise<CurrentState> => {
  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { success: false, error: true, message: "Invalid ID." };
  try {
    const session = await getSession();
    if (!session?.schoolId && session?.role !== "SUPER_ADMIN" && session?.role !== "provider") {
      return { success: false, error: true, message: "Unauthorized" };
    }
    const existing = await prisma.announcement.findUnique({ where: { id }, select: { schoolId: true } });
    if (!existing) return { success: false, error: true, message: "Announcement not found." };
    if (session.role !== "SUPER_ADMIN" && session.role !== "provider" && existing.schoolId !== session.schoolId) {
      return { success: false, error: true, message: "Forbidden: Cross-tenant access denied" };
    }

    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.error("[deleteAnnouncement]", err);
    return { success: false, error: true, message: "Failed to delete announcement." };
  }
};

// ─── FEES MANAGEMENT ──────────────────────────────────────────────────────────

import { getFeeStructures, getFeeRecords } from "./adminFeeActions";

export async function createFeeStructureForSchool(
  currentState: CurrentState,
  formData: FormData,
): Promise<CurrentState> {
  try {
    const session = await requireSession(["SCHOOL_ADMIN", "admin"]);
    if (!session.schoolId) return { success: false, error: true, message: "Unauthorized: Missing school context." };

    const { createFeeStructure: createAction } = await import("./adminFeeActions");
    const res = await createAction(null, formData);
    return { success: res.success, error: !res.success, message: res.message };
  } catch (err) {
    if (err instanceof Error && (err.message === "Unauthorized" || err.message === "Forbidden")) {
      return { success: false, error: true, message: err.message };
    }
    console.error("[createFeeStructureForSchool]", err);
    return { success: false, error: true, message: "Failed to create fee structure." };
  }
}

export async function assignFeeToStudent(
  currentState: CurrentState,
  data: AssignFeeSchema,
): Promise<CurrentState> {
  try {
    const session = await requireSession(["SCHOOL_ADMIN", "admin"]);
    if (!session.schoolId) return { success: false, error: true, message: "Unauthorized: Missing school context." };

    const fd = new FormData();
    fd.append("studentId", data.studentId);
    fd.append("structureId", data.feeStructureId);

    const { assignFeeToStudent: assignAction } = await import("./adminFeeActions");
    const res = await assignAction(null, fd);

    revalidatePath(`/list/students/${data.studentId}`);
    return { success: res.success, error: !res.success, message: res.message };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized") || err.message.includes("Forbidden")) {
        return { success: false, error: true, message: err.message };
      }
      return { success: false, error: true, message: err.message };
    }
    console.error("[assignFeeToStudent]", err);
    return { success: false, error: true, message: "Failed to assign fee to student." };
  }
}
