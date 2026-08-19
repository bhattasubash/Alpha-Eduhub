"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Lock, User, ArrowLeft, Shield, Users, Sparkles, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const demoUsers = [
  { role: "Super Admin", username: "demo.superadmin@alphaeduhub.com", password: "DemoSuperAdmin@123", icon: Shield, color: "from-purple-500 to-pink-500" },
  { role: "School Admin", username: "demo.admin@alphaeduhub.com", password: "DemoAdmin@123", icon: Users, color: "from-blue-500 to-cyan-500" },
  { role: "Teacher", username: "demo.teacher@alphaeduhub.com", password: "DemoTeacher@123", icon: GraduationCap, color: "from-green-500 to-emerald-500" },
  { role: "Student", username: "demo.student@alphaeduhub.com", password: "DemoStudent@123", icon: Sparkles, color: "from-orange-500 to-yellow-500" }
];



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

  async function handleDemoLogin(demo: typeof demoUsers[0]) {
    setIdentifier(demo.username);
    setPassword(demo.password);
    setError("");
    setLoading(true);
    
    try {
      // Use the existing authentication system
      await login(demo.username, demo.password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      
      // Check if it's a database connection error
      if (errorMessage.includes("connect") || errorMessage.includes("database") || errorMessage.includes("ECONNREFUSED")) {
        setError("Database not connected. Please set up your PostgreSQL database in .env file");
      } else if (errorMessage.includes("Invalid credentials")) {
        setError(`Demo user not found. Run setup to create demo users.`);
      } else {
        setError(errorMessage);
      }
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

            {/* Demo Login Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Demo Access</p>
                <p className="text-xs text-gray-400">Click any role for instant demo login</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {demoUsers.slice(0, 3).map((demo) => {
                  const Icon = demo.icon;
                  return (
                    <button
                      key={demo.role}
                      onClick={() => handleDemoLogin(demo)}
                      disabled={loading}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 disabled:opacity-50"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{demo.role}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                {demoUsers.slice(3).map((demo) => {
                  const Icon = demo.icon;
                  return (
                    <button
                      key={demo.role}
                      onClick={() => handleDemoLogin(demo)}
                      disabled={loading}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 disabled:opacity-50"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{demo.role}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-center">
                <Link 
                  href="/demo-login" 
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
                >
                  View full demo login page →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Link href="/" className="inline-flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </p>

        {/* LinkedIn Profile */}
        <div className="mt-4 text-center animate-slide-up" style={{ animationDelay: "250ms" }}>
          <a 
            href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006097] text-white rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            Connect on LinkedIn
          </a>
          <p className="text-xs text-gray-400 mt-2">Built by Mahammad Bilal Hyder</p>
        </div>
      </div>
    </div>
  );
}
