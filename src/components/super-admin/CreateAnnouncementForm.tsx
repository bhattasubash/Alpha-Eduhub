"use client";

import { useState, useTransition } from "react";
import { Megaphone, Loader2, CheckCircle, Plus, X } from "lucide-react";
import { createPlatformAnnouncement } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

export default function CreateAnnouncementForm() {
  const [open,    setOpen]    = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createPlatformAnnouncement({ success: false, error: false }, formData);
      if (result.success) {
        setSuccess(true);
        toast.success("Announcement broadcast to all schools!");
        setTimeout(() => { setSuccess(false); setOpen(false); }, 2000);
      } else {
        toast.error(result.message ?? "Failed to send announcement");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
      >
        <Plus className="w-4 h-4" />
        New Announcement
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">New Platform Announcement</h2>
            <p className="text-white/40 text-xs">Will be broadcast to all schools</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {success ? (
        <div className="flex items-center gap-3 py-4 justify-center">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Announcement sent to all schools!</span>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Title</label>
            <input name="title" required minLength={3}
              placeholder="System Maintenance Scheduled"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Message</label>
            <textarea name="content" required minLength={10} rows={4}
              placeholder="We will be performing scheduled maintenance on…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Type</label>
              <select name="type" defaultValue="INFO"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer">
                <option value="INFO">ℹ️ Info</option>
                <option value="WARNING">⚠️ Warning</option>
                <option value="MAINTENANCE">🔧 Maintenance</option>
                <option value="FEATURE">✨ Feature Update</option>
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Expires At (optional)</label>
              <input name="expiresAt" type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <><Megaphone className="w-4 h-4" />Broadcast</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
