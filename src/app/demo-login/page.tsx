"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Lock, User, ArrowLeft, Sparkles, Shield, Zap, Users, CheckCircle, Play, Settings as SettingsIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const demoCredentials = [
  {
    role: "Super Admin",
    username: "demo.superadmin@alphaeduhub.com",
    password: "DemoSuperAdmin@123",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    description: "Full system control & management"
  },
  {
    role: "School Admin", 
    username: "demo.admin@alphaeduhub.com",
    password: "DemoAdmin@123",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    description: "School operations & oversight"
  },
  {
    role: "Teacher",
    username: "demo.teacher@alphaeduhub.com", 
    password: "DemoTeacher@123",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    description: "Classroom management & teaching"
  },
  {
    role: "Student",
    username: "demo.student@alphaeduhub.com",
    password: "DemoStudent@123",
    icon: Sparkles,
    color: "from-orange-500 to-yellow-500",
    description: "Learning portal & activities"
  }
];

export default function DemoLoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<typeof demoCredentials[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleInstantLogin(demo: typeof demoCredentials[0]) {
    setSelectedDemo(demo);
    setError("");
    setLoading(true);
    
    try {
      // Use the existing authentication system
      await login(demo.username, demo.password);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
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

  async function setupDemoUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/setup-demo", {
        method: "POST",
      });
      const data = await res.json();
      
      if (res.ok) {
        setError("Demo users created! You can now login.");
      } else {
        setError(data.error || "Failed to setup demo users");
      }
    } catch (err) {
      setError("Failed to setup demo users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function selectDemo(demo: typeof demoCredentials[0]) {
    // Auto-login on selection for instant access
    handleInstantLogin(demo);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl"
        />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Panel - Demo Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30"
              >
                <GraduationCap className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Login</h1>
              <p className="text-gray-500 text-sm">Experience Alpha Edu Hub with demo accounts</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Demo Account</p>
              {demoCredentials.map((demo, index) => {
                const Icon = demo.icon;
                const isLoading = loading && selectedDemo?.role === demo.role;
                return (
                  <motion.button
                    key={demo.role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => selectDemo(demo)}
                    disabled={loading}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                      selectedDemo?.role === demo.role
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50"
                    } ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${demo.color} flex items-center justify-center shadow-lg`}>
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{demo.role}</h3>
                        <p className="text-xs text-gray-500">{demo.description}</p>
                      </div>
                      {selectedDemo?.role === demo.role && !isLoading && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      {isLoading && (
                        <span className="text-xs text-indigo-600 font-medium">Logging in...</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Instant Login</p>
                  <p className="text-xs text-gray-600">Click any role above for instant access. No password needed - just click and explore!</p>
                </div>
              </div>
            </div>

            <button
              onClick={setupDemoUsers}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <SettingsIcon className="w-4 h-4" />
                  Setup Demo Users
                </>
              )}
            </button>
          </motion.div>

          {/* Right Panel - Info & Manual Login */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                </div>
                <h1 className="text-white font-bold text-2xl tracking-tight">Alpha Edu Hub</h1>
                <p className="text-white/80 text-sm mt-2 font-light">Smart Schools. Smarter Future.</p>
              </div>
            </div>

            <div className="px-8 py-8 flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-gray-900 font-bold text-xl">Manual Login</h2>
                <p className="text-gray-500 text-sm mt-2">
                  {selectedDemo ? `Selected: ${selectedDemo.role}` : "Or use manual login below"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  >
                    ⚠ {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 hover-lift mt-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500 mb-3">
                  💡 <span className="font-semibold">Tip:</span> Use the instant login buttons on the left for quick access!
                </p>
                <p className="text-center text-xs text-gray-500">
                  Demo password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">demo123</span>
                </p>
                {error && error.includes("not found") && (
                  <button
                    onClick={setupDemoUsers}
                    className="mt-3 w-full py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    Click here to setup demo users
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </p>

        {/* LinkedIn Profile */}
        <div className="mt-6 text-center">
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

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-500">Redirecting to dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}