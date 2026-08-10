"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, LogOut, KeyRound, Trash2, Loader2, ShieldOff, ShieldCheck } from "lucide-react";
import { forceLogoutUser, resetUserPassword, deleteUser, suspendUser, impersonateUser, restoreUserSessions } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  userId:   string;
  username: string;
}

type Action = "logout" | "reset" | "delete" | "suspend" | "restore" | "impersonate";

export default function UserActionsMenu({ userId, username }: Props) {
  const [open,      setOpen]      = useState(false);
  const [action,    setAction]    = useState<Action | null>(null);
  const [newPw,     setNewPw]     = useState("");
  const [isPending, startTransition] = useTransition();
  const [position,  setPosition]  = useState({ top: 0, left: 0, direction: 'down' as 'up' | 'down' });
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  function close() { setOpen(false); setAction(null); setNewPw(""); }

  // Calculate dropdown position
  const updatePosition = () => {
    if (!buttonRef.current || !open) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 220; // Approximate height of dropdown
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    let direction: 'up' | 'down' = 'down';
    let top = rect.bottom + 4; // 4px gap below button
    
    // If not enough space below, open upward
    if (spaceBelow < dropdownHeight + 20 && spaceAbove > dropdownHeight + 20) {
      direction = 'up';
      top = rect.top - dropdownHeight - 4; // 4px gap above button
    }
    
    setPosition({
      top,
      left: rect.right - 192, // Align right edge (192px = w-48)
      direction
    });
  };

  // Update position on open and on scroll/resize
  useEffect(() => {
    if (open) {
      updatePosition();
      
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open]);

  async function run(a: Action) {
    const fd = new FormData();
    fd.set("userId", userId);
    if (a === "reset") fd.set("newPassword", newPw);

    startTransition(async () => {
      let result;
      if (a === "logout")  result = await forceLogoutUser({ success: false, error: false }, fd);
      else if (a === "reset")  result = await resetUserPassword({ success: false, error: false }, fd);
      else if (a === "delete") result = await deleteUser({ success: false, error: false }, fd);
      else if (a === "suspend") result = await suspendUser({ success: false, error: false }, fd);
      else if (a === "restore") result = await restoreUserSessions({ success: false, error: false }, fd);
      else                     result = await impersonateUser({ success: false, error: false }, fd);

      if (result?.success) {
        toast.success(result.message ?? "Action completed");
        close();
        if (a === "impersonate") {
          const redirectUrl = (result.data as { redirectUrl?: string })?.redirectUrl || "/";
          window.location.href = redirectUrl;
        } else {
          // Refresh page to show updated state for other actions
          window.location.reload();
        }
      } else {
        toast.error(result?.message ?? "Action failed");
      }
    });
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all shadow-lg hover:shadow-purple-500/20"
        title="User Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && !action && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-transparent" onClick={close} />
          <div 
            className="fixed z-[9999] w-48 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl py-2 overflow-hidden animate-in fade-in duration-200"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setAction("impersonate")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-all">
              <KeyRound className="w-4 h-4" />Login As
            </button>
            <div className="h-px bg-white/5 my-1" />
            <button onClick={() => setAction("logout")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-all">
              <LogOut className="w-4 h-4" />Force Logout
            </button>
            <button onClick={() => setAction("reset")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 transition-all">
              <KeyRound className="w-4 h-4" />Reset Password
            </button>
            <button onClick={() => setAction("suspend")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-orange-400 hover:bg-orange-500/10 transition-all">
              <ShieldOff className="w-4 h-4" />Suspend Sessions
            </button>
            <button onClick={() => setAction("restore")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-all">
              <ShieldCheck className="w-4 h-4" />Restore Sessions
            </button>
            <div className="h-px bg-white/5 my-1" />
            <button onClick={() => setAction("delete")}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 className="w-4 h-4" />Delete User
            </button>
          </div>
        </>,
        document.body
      )}

      {action && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={close}>
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-2">
              {action === "logout" ? "Force Logout" : action === "reset" ? "Reset Password" : action === "suspend" ? "Suspend Sessions" : action === "restore" ? "Restore Sessions" : action === "delete" ? "Delete User" : "Login As"}
            </h3>
            <p className="text-white/50 text-sm mb-4">
              {action === "delete"
                ? `Permanently delete "${username}"? This cannot be undone.`
                : action === "reset"
                ? `Set a new password for "${username}".`
                : action === "impersonate"
                ? `Are you sure you want to securely login as "${username}"? Your actions will be heavily audited.`
                : action === "restore"
                ? `Restore sessions for "${username}"? They will be able to log in again.`
                : `${action === "logout" ? "Terminate all sessions" : "Suspend all sessions"} for "${username}".`
              }
            </p>
            {action === "reset" && (
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40 mb-4"
              />
            )}
            <div className="flex gap-3">
              <button onClick={close} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button
                onClick={() => run(action)}
                disabled={isPending || (action === "reset" && newPw.length < 8)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                  action === "delete" ? "bg-red-600 hover:bg-red-500" : action === "restore" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-purple-600 hover:bg-purple-500"
                }`}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
