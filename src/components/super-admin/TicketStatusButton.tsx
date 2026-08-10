"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { updateTicketStatus } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  ticketId:      string;
  currentStatus: string;
}

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
const STATUS_LABELS = {
  OPEN: "Open", IN_PROGRESS: "In Progress", RESOLVED: "Resolved", CLOSED: "Closed",
};

export default function TicketStatusButton({ ticketId, currentStatus }: Props) {
  const [open,      setOpen]      = useState(false);
  const [isPending, startTransition] = useTransition();

  function changeStatus(status: string) {
    setOpen(false);
    const fd = new FormData();
    fd.set("ticketId", ticketId);
    fd.set("status", status);
    startTransition(async () => {
      const result = await updateTicketStatus({ success: false, error: false }, fd);
      if (result.success) {
        toast.success("Ticket updated");
      } else {
        toast.error(result.message ?? "Failed to update ticket");
      }
    });
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-all disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        {STATUS_LABELS[currentStatus as keyof typeof STATUS_LABELS] ?? currentStatus}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-36 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl py-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                className={`w-full text-left px-4 py-2 text-xs transition-all hover:bg-white/5 ${
                  s === currentStatus ? "text-purple-300 font-semibold" : "text-white/60"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
