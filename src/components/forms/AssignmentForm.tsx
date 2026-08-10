"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createAssignment, updateAssignment } from "@/lib/actions";

const AssignmentForm = ({
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
  const [loading, setLoading] = useState(false);

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    { success: false, error: false }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(`Assignment has been ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  }, [state, router, type, setOpen]);

  const { lessons = [], classes = [] } = relatedData || {};
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form
      action={(formData) => {
        setLoading(true);
        formAction(formData);
      }}
      className="flex flex-col gap-5 p-2"
    >
      <h1 className="text-xl font-semibold text-gray-800">
        {type === "create" ? "Create Assignment" : "Update Assignment"}
      </h1>

      {data?.id && <input type="hidden" name="id" value={data.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section / Class Selection */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Select Section / Class <span className="text-red-500">*</span></label>
          <select
            name="classId"
            defaultValue={data?.lesson?.classId || data?.classId || (classes[0]?.id ?? "")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400 bg-white"
            required
          >
            <option value="">-- Select Section / Class --</option>
            {classes.map((c: { id: number; name: string }) => (
              <option key={c.id} value={c.id}>
                Section {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Name Text Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Subject Name (Text) <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="subjectName"
            defaultValue={data?.lesson?.subject?.name || data?.lessonName || ""}
            placeholder="e.g. Mathematics, Science"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Assignment Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="title"
          defaultValue={data?.title || ""}
          placeholder="e.g. Homework #3 - Quadratic Equations"
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Start Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="startDate"
            defaultValue={data?.startDate ? new Date(data.startDate).toISOString().split("T")[0] : todayStr}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Due Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="dueDate"
            defaultValue={data?.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : todayStr}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Max Marks</label>
          <input
            type="number"
            name="maxMarks"
            defaultValue={data?.maxMarks ?? 100}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Instructions / Details</label>
        <textarea
          name="instructions"
          defaultValue={data?.instructions || data?.description || ""}
          placeholder="e.g. Complete exercises 1 to 10 on page 42"
          rows={3}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400"
        />
      </div>

      {state.error && <span className="text-red-500 text-sm">Something went wrong! Please check required fields.</span>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-2.5 rounded-md transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>{type === "create" ? "Creating Assignment..." : "Updating Assignment..."}</span>
          </>
        ) : (
          type === "create" ? "Create Assignment" : "Update Assignment"
        )}
      </button>
    </form>
  );
};

export default AssignmentForm;
