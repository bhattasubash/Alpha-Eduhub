"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions";

const EventForm = ({
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
    type === "create" ? createEvent : updateEvent,
    { success: false, error: false }
  );

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) toast.error("Something went wrong!");
  }, [state, router, type, setOpen]);

  const classes: { id: number; name: string }[] = relatedData?.classes || [];
  const todayStr = new Date().toISOString().slice(0, 16);

  return (
    <form action={formAction} className="flex flex-col gap-5 p-2">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Event" : "Update Event"}
      </h1>

      {data?.id && <input type="hidden" name="id" value={data.id} />}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Title <span className="text-red-400">*</span></label>
        <input type="text" name="title" defaultValue={data?.title || ""} placeholder="Event title" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Description</label>
        <textarea name="description" defaultValue={data?.description || ""} placeholder="Event description" rows={3} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Start Time <span className="text-red-400">*</span></label>
          <input type="datetime-local" name="startTime" defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : todayStr} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">End Time <span className="text-red-400">*</span></label>
          <input type="datetime-local" name="endTime" defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : todayStr} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400" required />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Class (leave empty for all classes)</label>
        <select name="classId" defaultValue={data?.class?.id || data?.classId || ""} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400">
          <option value="">All Classes (School-wide)</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {state.error && <span className="text-red-500 text-sm">Something went wrong!</span>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors font-medium">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default EventForm;
