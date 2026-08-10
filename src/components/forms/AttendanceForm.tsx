"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createAttendance, updateAttendance } from "@/lib/actions";

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const router = useRouter();

  const [state, formAction] = useFormState(
    type === "create" ? createAttendance : updateAttendance,
    { success: false, error: false }
  );

  useEffect(() => {
    if (state.success) {
      toast(`Attendance has been ${type === "create" ? "recorded" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [state, router, type, setOpen]);

  const students: { id: string; name: string; surname: string }[] =
    relatedData?.students || [];
  const lessons: { id: number; name: string }[] = relatedData?.lessons || [];

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="flex flex-col gap-6 p-2">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Mark Attendance" : "Update Attendance"}
      </h1>

      {data?.id && (
        <input type="hidden" name="id" value={data.id} />
      )}

      {/* Date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">
          Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          name="date"
          defaultValue={
            data?.date
              ? new Date(data.date).toISOString().split("T")[0]
              : todayStr
          }
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-blue-400"
          required
        />
      </div>

      {/* Student — only on create */}
      {type === "create" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Student <span className="text-red-400">*</span>
          </label>
          {students.length > 0 ? (
            <select
              name="studentId"
              defaultValue=""
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select a student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.surname}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              defaultValue={data?.studentId || ""}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-blue-400"
              required
            />
          )}
        </div>
      )}

      {/* Lesson — only on create */}
      {type === "create" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Lesson <span className="text-red-400">*</span>
          </label>
          {lessons.length > 0 ? (
            <select
              name="lessonId"
              defaultValue=""
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select a lesson…</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              name="lessonId"
              placeholder="Lesson ID"
              defaultValue={data?.lessonId || ""}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-blue-400"
              required
            />
          )}
        </div>
      )}

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">
          Status <span className="text-red-400">*</span>
        </label>
        <select
          name="present"
          defaultValue={data?.present === false ? "false" : "true"}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-blue-400"
          required
        >
          <option value="true">✅ Present</option>
          <option value="false">❌ Absent</option>
        </select>
      </div>

      {state.error && (
        <span className="text-red-500 text-sm">Something went wrong!</span>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
      >
        {type === "create" ? "Mark Attendance" : "Update"}
      </button>
    </form>
  );
};

export default AttendanceForm;
