import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { getRole, getCurrentUserId, getCurrentSchoolId } from "@/lib/getRole";

export type FormContainerProps = {
  table:
    | "teacher" | "student" | "parent" | "subject" | "class"
    | "lesson"  | "exam"    | "assignment" | "result"
    | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData: Record<string, unknown> = {};
  const role          = await getRole();
  const currentUserId = await getCurrentUserId();
  const schoolId      = await getCurrentSchoolId();

  if (type !== "delete" && schoolId) {
    try {
      switch (table) {
        case "subject": {
          const teachers = await prisma.teacher.findMany({
            where: { schoolId },
            select: { id: true, name: true, surname: true },
          });
          relatedData = { teachers };
          break;
        }
        case "class": {
          const [grades, teachers] = await Promise.all([
            prisma.grade.findMany({ where: { schoolId }, select: { id: true, level: true } }),
            prisma.teacher.findMany({ where: { schoolId }, select: { id: true, name: true, surname: true } }),
          ]);
          relatedData = { teachers, grades };
          break;
        }
        case "teacher": {
          const subjects = await prisma.subject.findMany({
            where: { schoolId }, select: { id: true, name: true },
          });
          relatedData = { subjects };
          break;
        }
        case "student": {
          const [grades, classes, parents] = await Promise.all([
            prisma.grade.findMany({ where: { schoolId }, select: { id: true, level: true } }),
            prisma.class.findMany({ where: { schoolId }, include: { _count: { select: { students: true } } } }),
            prisma.parent.findMany({ where: { schoolId }, select: { id: true, name: true, surname: true, username: true, phone: true } }),
          ]);
          relatedData = { classes, grades, parents };
          break;
        }
        case "parent":
          // no related data needed for parent form
          break;
        case "lesson": {
          const [subjects, classes, teachers] = await Promise.all([
            prisma.subject.findMany({ where: { schoolId }, select: { id: true, name: true } }),
            prisma.class.findMany({ where: { schoolId }, select: { id: true, name: true } }),
            prisma.teacher.findMany({ where: { schoolId }, select: { id: true, name: true, surname: true } }),
          ]);
          relatedData = { subjects, classes, teachers };
          break;
        }
        case "exam":
        case "assignment": {
          const [lessons, classes] = await Promise.all([
            prisma.lesson.findMany({
              where: role === "teacher" && currentUserId
                ? { teacherId: currentUserId }
                : { schoolId },
              select: { id: true, name: true },
            }),
            prisma.class.findMany({
              where: { schoolId },
              select: { id: true, name: true, capacity: true },
              orderBy: { name: "asc" },
            }),
          ]);
          relatedData = { lessons, classes };
          break;
        }
        case "result": {
          const [students, exams, assignments] = await Promise.all([
            prisma.student.findMany({
              where: { schoolId },
              select: { id: true, name: true, surname: true },
              take: 200,
            }),
            prisma.exam.findMany({
              where: { schoolId },
              select: { id: true, title: true },
            }),
            prisma.assignment.findMany({
              where: { schoolId },
              select: { id: true, title: true },
            }),
          ]);
          relatedData = { students, exams, assignments };
          break;
        }
        case "attendance": {
          const [students, lessons] = await Promise.all([
            prisma.student.findMany({
              where: role === "teacher" && currentUserId
                ? { class: { lessons: { some: { teacherId: currentUserId } } }, schoolId }
                : { schoolId },
              select: { id: true, name: true, surname: true },
              take: 200,
            }),
            prisma.lesson.findMany({
              where: role === "teacher" && currentUserId
                ? { teacherId: currentUserId }
                : { schoolId },
              select: { id: true, name: true },
            }),
          ]);
          relatedData = { students, lessons };
          break;
        }
        case "event":
        case "announcement": {
          const classes = await prisma.class.findMany({
            where: { schoolId }, select: { id: true, name: true },
          });
          relatedData = { classes };
          break;
        }
      }
    } catch (err) {
      console.warn("[FormContainer] DB error, falling back to empty relatedData:", err);
      relatedData = {};
    }
  }

  return (
    <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
  );
};

export default FormContainer;
