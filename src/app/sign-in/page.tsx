"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";



export default function SignInPage() {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState(""); // email or username
  const [password,   setPassword]   = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Email/username and password are required.");
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      // Navigation is handled inside AuthContext.login
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden hover-lift">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-white font-bold text-2xl tracking-tight">Alpha Edu Hub</h1>
              <p className="text-white/80 text-sm mt-2 font-light">Smart Schools. Smarter Future.</p>
            </div>
          </div>

          <div className="px-8 py-8 flex flex-col gap-6">
            <div className="text-center animate-slide-up">
              <h2 className="text-gray-900 font-bold text-xl">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-2">Sign in with your email or username</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "50ms" }} noValidate>

              {/* Email or Username */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                  Email or Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-400 backdrop-blur-sm"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-600 font-medium uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white/50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-400 backdrop-blur-sm"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-pulse-slow">
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 hover-lift mt-2"
              >
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Link href="/" className="inline-flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
