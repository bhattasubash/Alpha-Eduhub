"use client";

/**
 * AuthContext — replaces all Clerk hooks (useAuth, useUser, useClerk).
 *
 * Provides:
 *   useAuth() → { user, isLoading, isAuthenticated, login, logout, refresh }
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:       string;
  username: string;
  email:    string;
  role:     "SUPER_ADMIN" | "provider" | "admin" | "SCHOOL_ADMIN" | "teacher" | "TEACHER" | "student" | "STUDENT" | "PARENT";
  schoolId: string | null;
  school?:  { id: string; name: string } | null;
}

interface AuthContextValue {
  user:            AuthUser | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  login:  (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router  = useRouter();
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount (access token already in httpOnly cookie)
  const loadUser = useCallback(async () => {
    try {
      let res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.status === 401) {
        const refreshed = await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
        });
        if (refreshed.ok) res = await fetch("/api/auth/me", { credentials: "include" });
      }
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ login: username, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Login failed");
    }

    const data = await res.json();
    setUser(data.user);

    // Redirect to role dashboard using window.location for immediate redirect
    const roleRoutes: Record<string, string> = {
      SUPER_ADMIN:  "/super-admin",
      provider:     "/provider",
      admin:        "/admin",
      SCHOOL_ADMIN: "/admin",
      teacher:      "/teacher",
      TEACHER:      "/teacher",
      student:      "/student",
      STUDENT:      "/student",
      PARENT:       "/parent",
    };
    window.location.href = roleRoutes[data.user.role] ?? "/";
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    // Clear user state immediately for fast UI response
    setUser(null);
    
    // Call logout API in background (non-blocking)
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch((error) => console.log("Logout API call failed:", error));
    
    // Redirect immediately using window.location for force redirect
    window.location.href = "/sign-in";
  }, []);

  // ── Refresh ────────────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      await loadUser();
    } else {
      setUser(null);
      router.push("/sign-in");
    }
  }, [loadUser, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
