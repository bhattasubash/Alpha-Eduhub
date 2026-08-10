"use client";

import { useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateSchool } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  school: {
    id:             string;
    name:           string;
    email:          string;
    phone:          string;
    address:        string;
    website:        string;
    status:         string;
    timezone:       string;
    academicYear:   string;
    storageLimitMb: number;
  };
}

const TIMEZONES = [
  "Asia/Kolkata","Asia/Dubai","Asia/Singapore","Asia/Tokyo",
  "Europe/London","Europe/Paris","America/New_York","America/Los_Angeles","UTC",
];

export default function EditSchoolForm({ school }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("id", school.id);
    startTransition(async () => {
      const result = await updateSchool({ success: false, error: false }, formData);
      if (result.success) {
        toast.success("School updated successfully!");
      } else {
        toast.error(result.message ?? "Failed to update school");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-white font-semibold mb-6">Edit School Details</h2>
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">School Name</label>
            <input name="name" defaultValue={school.name} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Email</label>
              <input name="email" type="email" defaultValue={school.email}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Phone</label>
              <input name="phone" defaultValue={school.phone}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Address</label>
            <input name="address" defaultValue={school.address}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Website</label>
            <input name="website" type="url" defaultValue={school.website} placeholder="https://"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Status</label>
              <select name="status" defaultValue={school.status}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer">
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Academic Year</label>
              <input name="academicYear" defaultValue={school.academicYear} placeholder="2025-26"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Timezone</label>
              <select name="timezone" defaultValue={school.timezone}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer">
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Storage Limit (MB)</label>
              <input name="storageLimitMb" type="number" defaultValue={school.storageLimitMb} min={128} step={128}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-60 shadow-lg shadow-purple-500/20"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
