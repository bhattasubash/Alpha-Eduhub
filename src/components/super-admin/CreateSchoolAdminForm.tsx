"use client";

import { useState, useTransition } from "react";
import { UserPlus, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { createSchoolAdmin } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  schoolId:   string;
  schoolName: string;
}

export default function CreateSchoolAdminForm({ schoolId, schoolName }: Props) {
  const [showPw,    setShowPw]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("schoolId", schoolId);
    startTransition(async () => {
      const result = await createSchoolAdmin({ success: false, error: false }, formData);
      if (result.success) {
        setSuccess(true);
        toast.success("School admin created successfully!");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast.error(result.message ?? "Failed to create admin");
      }
    });
  }

  return (
    <div className="max-w-lg">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Create School Admin</h2>
            <p className="text-white/40 text-xs">
              Add an administrator for <span className="text-purple-300">{schoolName}</span>
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Admin created successfully!
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              name="username"
              required
              minLength={3}
              placeholder="admin_greenwood"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@greenwood.edu"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-10 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-white/20 text-xs mt-1">
              Use: Uppercase, lowercase, number, special char
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating Admin…</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Create Admin</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
