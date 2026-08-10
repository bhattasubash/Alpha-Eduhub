"use client";

import { useTransition } from "react";
import { UserCheck, LogOut, ShieldAlert } from "lucide-react";
import { clearImpersonation, exitImpersonation } from "@/lib/superAdminActions";

interface Props {
  isImpersonating: boolean;
  schoolName?: string;
  isDeepImpersonating?: boolean;
  impersonatedUsername?: string;
}

export default function ImpersonationBanner({ isImpersonating, schoolName, isDeepImpersonating, impersonatedUsername }: Props) {
  const [isPending, startTransition] = useTransition();

  if (!isImpersonating && !isDeepImpersonating) return null;

  const handleExit = () => {
    startTransition(async () => {
      if (isDeepImpersonating) {
        const formData = new FormData();
        await exitImpersonation({ success: false, error: false }, formData);
      } else {
        await clearImpersonation();
      }
      window.location.href = "/super-admin/users";
    });
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-50 animate-pulse">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-200" />
        <span>
          SUPER ADMIN IMPERSONATION MODE: Viewing dashboard as{" "}
          {isDeepImpersonating ? (
            <>
              user <span className="underline font-bold">{impersonatedUsername}</span>
            </>
          ) : (
            <>
              Admin for <span className="underline font-bold">{schoolName || "Selected School"}</span>
            </>
          )}
          . Every action is logged in audit trails.
        </span>
      </div>
      <button
        onClick={handleExit}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1 bg-black/30 hover:bg-black/50 border border-white/20 rounded-lg text-white text-xs transition-all shadow-inner"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{isPending ? "Exiting…" : "Exit Impersonation"}</span>
      </button>
    </div>
  );
}
