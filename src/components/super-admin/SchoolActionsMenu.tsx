"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  MoreVertical, Eye, Edit, PowerOff, Power, Trash2,
  UserPlus, CheckCircle, XCircle, Loader2,
} from "lucide-react";
import { suspendSchool, activateSchool, deleteSchool } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  schoolId:      string;
  schoolName:    string;
  currentStatus: string;
}

export default function SchoolActionsMenu({ schoolId, schoolName, currentStatus }: Props) {
  const [open,    setOpen]    = useState(false);
  const [confirm, setConfirm] = useState<null | "delete" | "suspend" | "activate">(null);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  function closeAll() { setOpen(false); setConfirm(null); }

  async function handleAction(action: "suspend" | "activate" | "delete") {
    const fd = new FormData();
    fd.set("id", schoolId);

    startTransition(async () => {
      let result;
      if (action === "suspend")  result = await suspendSchool({  success: false, error: false }, fd);
      else if (action === "activate") result = await activateSchool({ success: false, error: false }, fd);
      else                       result = await deleteSchool({    success: false, error: false }, fd);

      if (result.success) {
        toast.success(`School ${action}d successfully`);
        closeAll();
      } else {
        toast.error(result.message ?? `Failed to ${action} school`);
      }
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
        aria-label="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && !confirm && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={closeAll} />

          <div className="absolute right-0 top-9 z-50 w-48 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden py-1">
            <Link
              href={`/super-admin/schools/${schoolId}`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              onClick={closeAll}
            >
              <Eye className="w-4 h-4 text-blue-400" />
              View Details
            </Link>

            <Link
              href={`/super-admin/schools/${schoolId}?tab=edit`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              onClick={closeAll}
            >
              <Edit className="w-4 h-4 text-purple-400" />
              Edit School
            </Link>

            <Link
              href={`/super-admin/schools/${schoolId}?tab=admin`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              onClick={closeAll}
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Add Admin
            </Link>

            <div className="h-px bg-white/5 my-1" />

            {currentStatus !== "SUSPENDED" ? (
              <button
                onClick={() => setConfirm("suspend")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-all"
              >
                <PowerOff className="w-4 h-4" />
                Suspend School
              </button>
            ) : (
              <button
                onClick={() => setConfirm("activate")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-all"
              >
                <Power className="w-4 h-4" />
                Activate School
              </button>
            )}

            <button
              onClick={() => setConfirm("delete")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete School
            </button>
          </div>
        </>
      )}

      {/* Confirmation dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeAll}>
          <div
            className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              confirm === "delete"   ? "bg-red-500/10"    :
              confirm === "suspend"  ? "bg-amber-500/10"  :
                                       "bg-emerald-500/10"
            }`}>
              {confirm === "delete"   ? <Trash2  className="w-6 h-6 text-red-400"     /> :
               confirm === "suspend"  ? <PowerOff className="w-6 h-6 text-amber-400"  /> :
                                        <Power   className="w-6 h-6 text-emerald-400" />
              }
            </div>

            <h3 className="text-white font-semibold text-lg mb-2">
              {confirm === "delete"  ? "Delete School" :
               confirm === "suspend" ? "Suspend School" : "Activate School"}
            </h3>
            <p className="text-white/50 text-sm mb-5">
              {confirm === "delete"
                ? `This will permanently delete "${schoolName}" and all its data. This cannot be undone.`
                : confirm === "suspend"
                ? `"${schoolName}" will be suspended. All users will lose access.`
                : `"${schoolName}" will be reactivated and users will regain access.`
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeAll}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirm)}
                disabled={isPending}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                  confirm === "delete"   ? "bg-red-600 hover:bg-red-500"                 :
                  confirm === "suspend"  ? "bg-amber-600 hover:bg-amber-500"             :
                                           "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirm === "delete" ? "Delete" : confirm === "suspend" ? "Suspend" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
