"use client";

import {
  deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher,
  deleteAttendance, deleteAssignment, deleteResult, deleteEvent,
  deleteAnnouncement, deleteLesson, deleteParent,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

// ── Delete action map ──────────────────────────────────────────────────────────
const deleteActionMap: Record<string, (s: any, f: FormData) => Promise<any>> = {
  subject:      deleteSubject,
  class:        deleteClass,
  teacher:      deleteTeacher,
  student:      deleteStudent,
  exam:         deleteExam,
  parent:       deleteParent,
  lesson:       deleteLesson,
  assignment:   deleteAssignment,
  result:       deleteResult,
  attendance:   deleteAttendance,
  event:        deleteEvent,
  announcement: deleteAnnouncement,
};

// ── Lazy-loaded forms ──────────────────────────────────────────────────────────
const TeacherForm      = dynamic(() => import("./forms/TeacherForm"),      { loading: () => <Spinner /> });
const StudentForm      = dynamic(() => import("./forms/StudentForm"),      { loading: () => <Spinner /> });
const ParentForm       = dynamic(() => import("./forms/ParentForm"),       { loading: () => <Spinner /> });
const SubjectForm      = dynamic(() => import("./forms/SubjectForm"),      { loading: () => <Spinner /> });
const ClassForm        = dynamic(() => import("./forms/ClassForm"),        { loading: () => <Spinner /> });
const LessonForm       = dynamic(() => import("./forms/LessonForm"),       { loading: () => <Spinner /> });
const ExamForm         = dynamic(() => import("./forms/ExamForm"),         { loading: () => <Spinner /> });
const AssignmentForm   = dynamic(() => import("./forms/AssignmentForm"),   { loading: () => <Spinner /> });
const ResultForm       = dynamic(() => import("./forms/ResultForm"),       { loading: () => <Spinner /> });
const AttendanceForm   = dynamic(() => import("./forms/AttendanceForm"),   { loading: () => <Spinner /> });
const EventForm        = dynamic(() => import("./forms/EventForm"),        { loading: () => <Spinner /> });
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), { loading: () => <Spinner /> });

type FormRenderer = (
  setOpen: Dispatch<SetStateAction<boolean>>,
  type: "create" | "update",
  data?: any,
  relatedData?: any,
) => React.ReactNode;

const forms: Record<string, FormRenderer> = {
  subject:      (setOpen, type, data, rd) => <SubjectForm      type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  class:        (setOpen, type, data, rd) => <ClassForm        type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  teacher:      (setOpen, type, data, rd) => <TeacherForm      type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  student:      (setOpen, type, data, rd) => <StudentForm      type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  parent:       (setOpen, type, data, rd) => <ParentForm       type={type} data={data} setOpen={setOpen} />,
  lesson:       (setOpen, type, data, rd) => <LessonForm       type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  exam:         (setOpen, type, data, rd) => <ExamForm         type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  assignment:   (setOpen, type, data, rd) => <AssignmentForm   type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  result:       (setOpen, type, data, rd) => <ResultForm       type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  attendance:   (setOpen, type, data, rd) => <AttendanceForm   type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  event:        (setOpen, type, data, rd) => <EventForm        type={type} data={data} setOpen={setOpen} relatedData={rd} />,
  announcement: (setOpen, type, data, rd) => <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={rd} />,
};

// ── Spinner ────────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex items-center justify-center p-8">
    <span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── Delete confirmation form ───────────────────────────────────────────────────
const DeleteForm = ({
  table, id, setOpen,
}: {
  table: FormContainerProps["table"];
  id: number | string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const action = deleteActionMap[table];
  const [state, formAction] = useFormState(action, { success: false, error: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`${table.charAt(0).toUpperCase() + table.slice(1)} deleted successfully!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      setIsDeleting(false);
      toast.error(state.message ?? `Failed to delete ${table}.`);
    }
  }, [state, router, table, setOpen]);

  return (
    <form
      action={(formData) => {
        setIsDeleting(true);
        formAction(formData);
      }}
      className="p-6 flex flex-col items-center gap-6"
    >
      <input type="hidden" name="id" value={id} readOnly />
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
        🗑️
      </div>
      <p className="text-center text-base font-medium text-gray-800">
        All associated data will be permanently removed.
        <br />
        Are you sure you want to delete this <strong className="capitalize">{table}</strong>?
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isDeleting}
          className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Deleting...</span>
            </>
          ) : (
            "Yes, Delete"
          )}
        </button>
      </div>
    </form>
  );
};

// ── Main modal ─────────────────────────────────────────────────────────────────
const FormModal = ({
  table, type, data, id, relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size    = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = type === "create" ? "bg-lamaYellow" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple";
  const [open, setOpen] = useState(false);

  const renderContent = () => {
    if (type === "delete" && id !== undefined) {
      return <DeleteForm table={table} id={id} setOpen={setOpen} />;
    }
    if ((type === "create" || type === "update") && forms[table]) {
      return forms[table](setOpen, type, data, relatedData);
    }
    return <p className="p-4 text-center text-gray-500 text-sm">Form not available.</p>;
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
        aria-label={`${type} ${table}`}
      >
        <Image src={`/${type}.png`} alt={type} width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            {renderContent()}
            <button
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
              aria-label="Close modal"
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
