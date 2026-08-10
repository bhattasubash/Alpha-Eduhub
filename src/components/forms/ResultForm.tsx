"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createResult, updateResult } from "@/lib/actions";

const ResultForm = ({
  type, data, setOpen, relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false },
  );

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) toast.error(state.message ?? "Something went wrong!");
  }, [state, router, type, setOpen]);

  const students: { id: string; name: string; surname: string }[] = relatedData?.students ?? [];
  const exams:    { id: number; title: string }[]                  = relatedData?.exams    ?? [];
  const assignments: { id: number; title: string }[]               = relatedData?.assignments ?? [];

  return (
    <form action={formAction} className="flex flex-col gap-5 p-2">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Record Result" : "Update Result"}
      </h1>

      {data?.id && <input type="hidden" name="id" value={data.id} />}

      {type === "create" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Student <span className="text-red-400">*</span></label>
          <select name="studentId" defaultValue="" required className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400">
            <option value="" disabled>Select student…</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} {s.surname}</option>)}
          </select>
        </div>
      )}
      {type === "update" && data?.studentId && (
        <input type="hidden" name="studentId" value={data.studentId} />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Score (0–100) <span className="text-red-400">*</span></label>
        <input type="number" name="score" min={0} max={100} defaultValue={data?.score ?? ""} required
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400 w-full" />
      </div>

      {type === "create" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Exam (optional)</label>
            <select name="examId" defaultValue="" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400">
              <option value="">— None —</option>
              {exams.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Assignment (optional)</label>
            <select name="assignmentId" defaultValue="" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400">
              <option value="">— None —</option>
              {assignments.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <p className="text-xs text-gray-400">Select at least one: exam or assignment.</p>
        </>
      )}

      {state.error && <span className="text-red-500 text-sm">{state.message ?? "Something went wrong!"}</span>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors font-medium">
        {type === "create" ? "Record" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
