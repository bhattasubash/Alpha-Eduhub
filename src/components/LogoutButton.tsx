"use client";

import Image from "next/image";

interface LogoutButtonProps {
  showImage?: boolean;
  showLabel?: boolean;
}

export default function LogoutButton({ showImage = true, showLabel = false }: LogoutButtonProps) {
  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => console.log("Logout failed"));
    window.location.href = "/sign-in";
  };

  return (
    <button 
      onClick={handleLogout} 
      title="Sign out"
      className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
    >
      {showImage && <Image src="/logout.png" alt="Sign out" width={20} height={20} />}
      {showLabel && <span>Logout</span>}
    </button>
  );
}