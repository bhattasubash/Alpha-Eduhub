import { z } from "zod";

// ── Subject ───────────────────────────────────────────────────────────────────
export const subjectSchema = z.object({
  id:       z.coerce.number().optional(),
  name:     z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),
});
export type SubjectSchema = z.infer<typeof subjectSchema>;

// ── Class ─────────────────────────────────────────────────────────────────────
export const classSchema = z.object({
  id:           z.coerce.number().optional(),
  name:         z.string().min(1, { message: "Class name is required!" }),
  capacity:     z.coerce.number().min(1, { message: "Capacity is required!" }),
  gradeId:      z.coerce.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.coerce.string().optional(),
});
export type ClassSchema = z.infer<typeof classSchema>;

// ── Teacher ───────────────────────────────────────────────────────────────────
export const teacherSchema = z.object({
  id:        z.string().optional(),
  username:  z.string().min(3).max(20),
  password:  z.string().min(8).optional().or(z.literal("")),
  name:      z.string().min(1, { message: "First name is required!" }),
  surname:   z.string().min(1, { message: "Last name is required!" }),
  email:     z.string().email().optional().or(z.literal("")),
  phone:     z.string().optional(),
  address:   z.string().min(1, { message: "Address is required!" }),
  img:       z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday:  z.coerce.date({ message: "Birthday is required!" }),
  sex:       z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects:  z.array(z.string()).optional(),
});
export type TeacherSchema = z.infer<typeof teacherSchema>;

// ── Student ───────────────────────────────────────────────────────────────────
export const studentSchema = z.object({
  id:                z.string().optional(),
  schoolName:        z.string().min(1, { message: "School name prefix is required!" }),
  username:          z.string().optional(),
  password:          z.string().min(6).optional().or(z.literal("")),
  name:              z.string().min(1, { message: "First name is required!" }),
  surname:           z.string().min(1, { message: "Last name is required!" }),
  email:             z.string().optional().or(z.literal("")),
  phone:             z.string().optional(),
  address:           z.string().min(1, { message: "Address is required!" }),
  img:               z.string().optional(),
  bloodType:         z.string().min(1, { message: "Blood Type is required!" }),
  birthday:          z.coerce.date({ message: "Birthday is required!" }),
  sex:               z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId:           z.coerce.number().min(1, { message: "Grade is required!" }),
  classId:           z.coerce.number().min(1, { message: "Class is required!" }),
  parentId:          z.string().optional().or(z.literal("")),
  parentMode:        z.enum(["existing", "new"]).optional().default("existing"),
  newParentName:     z.string().optional(),
  newParentSurname:  z.string().optional(),
  newParentPhone:    z.string().optional(),
  newParentPassword: z.string().optional(),
});
export type StudentSchema = z.infer<typeof studentSchema>;

export const bulkStudentItemSchema = z.object({
  name:     z.string().min(1, { message: "First name is required!" }),
  surname:  z.string().min(1, { message: "Last name is required!" }),
  username: z.string().optional(),
  sex:      z.enum(["MALE", "FEMALE"]).default("MALE"),
  email:    z.string().optional().or(z.literal("")),
  phone:    z.string().optional(),
});
export type BulkStudentItemSchema = z.infer<typeof bulkStudentItemSchema>;

export const bulkStudentSchema = z.object({
  // schoolName and defaultPassword are now auto-generated server-side; kept optional for backward compat
  schoolName:        z.string().optional().or(z.literal("")),
  gradeId:           z.coerce.number().min(1, { message: "Grade is required!" }),
  classId:           z.coerce.number().min(1, { message: "Class is required!" }),
  defaultPassword:   z.string().optional().or(z.literal("")),
  parentId:          z.string().optional().or(z.literal("")),
  parentMode:        z.enum(["existing", "new"]).optional().default("existing"),
  newParentName:     z.string().optional(),
  newParentSurname:  z.string().optional(),
  newParentPhone:    z.string().optional(),
  newParentPassword: z.string().optional(),
  students:          z.array(bulkStudentItemSchema).min(1, { message: "At least 1 student is required!" }),
});
export type BulkStudentSchema = z.infer<typeof bulkStudentSchema>;

// ── Parent ────────────────────────────────────────────────────────────────────
export const parentSchema = z.object({
  id:       z.string().optional(),
  username: z.string().min(3).max(20),
  password: z.string().min(8).optional().or(z.literal("")),
  name:     z.string().min(1, { message: "First name is required!" }),
  surname:  z.string().min(1, { message: "Last name is required!" }),
  email:    z.string().email().optional().or(z.literal("")),
  phone:    z.string().min(1, { message: "Phone is required!" }),
  address:  z.string().min(1, { message: "Address is required!" }),
  img:      z.string().optional(),
});
export type ParentSchema = z.infer<typeof parentSchema>;

// ── Exam ──────────────────────────────────────────────────────────────────────
export const examSchema = z.object({
  id:           z.coerce.number().optional(),
  title:        z.string().min(1, { message: "Title is required!" }),
  startTime:    z.coerce.date({ message: "Start time is required!" }),
  endTime:      z.coerce.date({ message: "End time is required!" }),
  classId:      z.coerce.number().optional(),
  subjectName:  z.string().optional(),
  lessonId:     z.coerce.number().optional(),
  maxMarks:     z.coerce.number().min(1, { message: "Max marks required!" }).optional(),
  passingMarks: z.coerce.number().min(0, { message: "Passing marks required!" }).optional(),
  instructions: z.string().optional(),
});
export type ExamSchema = z.infer<typeof examSchema>;

// ── Lesson ────────────────────────────────────────────────────────────────────
export const lessonSchema = z.object({
  id:        z.coerce.number().optional(),
  name:      z.string().min(1, { message: "Lesson name is required!" }),
  day:       z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day is required!",
  }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime:   z.coerce.date({ message: "End time is required!" }),
  subjectId: z.coerce.number({ message: "Subject is required!" }),
  classId:   z.coerce.number({ message: "Class is required!" }),
  teacherId: z.string().min(1, { message: "Teacher is required!" }),
});
export type LessonSchema = z.infer<typeof lessonSchema>;

export const assignmentSchema = z.object({
  id:           z.coerce.number().optional(),
  title:        z.string().min(1, { message: "Title is required!" }),
  startDate:    z.coerce.date({ message: "Start date is required!" }),
  dueDate:      z.coerce.date({ message: "Due date is required!" }),
  classId:      z.coerce.number().optional(),
  subjectName:  z.string().optional(),
  lessonId:     z.coerce.number().optional(),
  maxMarks:     z.coerce.number().min(1).optional(),
  instructions: z.string().optional(),
});
export type AssignmentSchema = z.infer<typeof assignmentSchema>;

// ── Result ────────────────────────────────────────────────────────────────────
export const resultSchema = z.object({
  id:           z.coerce.number().optional(),
  score:        z.coerce.number().min(0).max(100, { message: "Score must be 0–100!" }),
  studentId:    z.string().min(1, { message: "Student is required!" }),
  examId:       z.coerce.number().optional().nullable(),
  assignmentId: z.coerce.number().optional().nullable(),
});
export type ResultSchema = z.infer<typeof resultSchema>;

// ── Bulk Attendance ───────────────────────────────────────────────────────────
export const bulkAttendanceSchema = z.object({
  lessonId: z.coerce.number().min(1, { message: "Lesson is required!" }),
  date:     z.coerce.date({ message: "Date is required!" }),
  records:  z.array(z.object({
    studentId: z.string().min(1),
    present:   z.boolean(),
  })).min(1, { message: "At least one student record is required!" }),
});
export type BulkAttendanceSchema = z.infer<typeof bulkAttendanceSchema>;

// ── Bulk Results ──────────────────────────────────────────────────────────────
export const bulkResultSchema = z.object({
  examId:       z.coerce.number().optional().nullable(),
  assignmentId: z.coerce.number().optional().nullable(),
  records:      z.array(z.object({
    studentId: z.string().min(1),
    score:     z.coerce.number().min(0).max(100),
  })).min(1, { message: "At least one score is required!" }),
});
export type BulkResultSchema = z.infer<typeof bulkResultSchema>;

// ── Discipline ────────────────────────────────────────────────────────────────
export const disciplineSchema = z.object({
  id:          z.coerce.number().optional(),
  date:        z.coerce.date({ message: "Date is required!" }),
  type:        z.enum(["WARNING", "DETENTION", "SUSPENSION", "NOTE"], { message: "Type is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  studentId:   z.string().min(1, { message: "Student is required!" }),
});
export type DisciplineSchema = z.infer<typeof disciplineSchema>;

// ── Fees ──────────────────────────────────────────────────────────────────────
export const feeStructureSchema = z.object({
  id:          z.string().optional(),
  name:        z.string().min(3, { message: "Fee name is required!" }),
  description: z.string().optional(),
  totalAmount: z.coerce.number().min(0, { message: "Total amount must be positive!" }),
});
export type FeeStructureSchema = z.infer<typeof feeStructureSchema>;

export const assignFeeSchema = z.object({
  studentId:      z.string().min(1, { message: "Student is required!" }),
  feeStructureId: z.string().min(1, { message: "Fee structure is required!" }),
});
export type AssignFeeSchema = z.infer<typeof assignFeeSchema>;
