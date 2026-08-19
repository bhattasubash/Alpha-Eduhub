"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Call logout API in background without waiting
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => console.log("Logout API call failed"));
    
    // Redirect immediately using window.location for force redirect
    window.location.href = "/sign-in";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-lamaSkyLight gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-700 font-semibold text-sm">Logging out…</p>
    </div>
  );
}
