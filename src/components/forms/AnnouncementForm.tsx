"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";

const AnnouncementForm = ({
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
    type === "create" ? createAnnouncement : updateAnnouncement,
    { success: false, error: false }
  );

  useEffect(() => {
    if (state.success) {
      toast(`Announcement has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) toast.error("Something went wrong!");
  }, [state, router, type, setOpen]);

  const classes: { id: number; name: string }[] = relatedData?.classes || [];
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="flex flex-col gap-5 p-2">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Announcement" : "Update Announcement"}
      </h1>

      {data?.id && <input type="hidden" name="id" value={data.id} />}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Title <span className="text-red-400">*</span></label>
        <input type="text" name="title" defaultValue={data?.title || ""} placeholder="Announcement title" className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Description <span className="text-red-400">*</span></label>
        <textarea name="description" defaultValue={data?.description || ""} placeholder="Announcement details…" rows={4} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400 resize-none" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Date <span className="text-red-400">*</span></label>
        <input type="date" name="date" defaultValue={data?.date ? new Date(data.date).toISOString().split("T")[0] : todayStr} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Class (leave empty for all)</label>
        <select name="classId" defaultValue={data?.class?.id || data?.classId || ""} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-blue-400">
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {state.error && <span className="text-red-500 text-sm">Something went wrong!</span>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors font-medium">
        {type === "create" ? "Post Announcement" : "Update"}
      </button>
    </form>
  );
};

export default AnnouncementForm;
