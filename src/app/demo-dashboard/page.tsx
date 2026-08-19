"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Shield, Users, Sparkles, Zap, ExternalLink, ArrowLeft, Home, BookOpen, Calendar, ClipboardList, Award, Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function DemoDashboard() {
  const [demoUser, setDemoUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    // Get demo user from localStorage
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setDemoUser(user);
      setRole(user.role.replace('_', ' '));
    }
  }, []);

  const roleColors: Record<string, string> = {
    "SUPER ADMIN": "from-purple-600 to-pink-600",
    "SCHOOL ADMIN": "from-blue-600 to-cyan-600", 
    "TEACHER": "from-green-600 to-emerald-600",
    "STUDENT": "from-orange-600 to-yellow-600",
    "PARENT": "from-indigo-600 to-purple-600"
  };

  const roleIcons: Record<string, any> = {
    "SUPER ADMIN": Shield,
    "SCHOOL ADMIN": Users,
    "TEACHER": GraduationCap,
    "STUDENT": Sparkles,
    "PARENT": Zap
  };

  const RoleIcon = roleIcons[role] || Users;

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "#dashboard" },
    { icon: BookOpen, label: "Classes", href: "#classes" },
    { icon: Calendar, label: "Timetable", href: "#timetable" },
    { icon: ClipboardList, label: "Assignments", href: "#assignments" },
    { icon: Award, label: "Performance", href: "#performance" },
    { icon: Bell, label: "Notifications", href: "#notifications" },
    { icon: Settings, label: "Settings", href: "#settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alpha Edu Hub</h1>
                <p className="text-xs text-gray-500">School Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {demoUser?.username} ({role})
              </span>
              <Link
                href="/demo-login"
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col items-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleColors[role] || "from-indigo-600 to-purple-600"} flex items-center justify-center mb-4 shadow-lg`}>
                  <RoleIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{role}</h2>
                <p className="text-sm text-gray-500">Demo Account</p>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
                <p className="text-gray-600">
                  This is a demo dashboard showing the {role} interface of Alpha Edu Hub.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Classes</h3>
                  <p className="text-3xl font-bold text-green-600">56</p>
                  <p className="text-sm text-gray-500 mt-1">Across all subjects</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
                  <p className="text-3xl font-bold text-purple-600">89</p>
                  <p className="text-sm text-gray-500 mt-1">This semester</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "New assignment created", time: "2 hours ago" },
                    { action: "Attendance marked", time: "4 hours ago" },
                    { action: "Performance report generated", time: "1 day ago" },
                    { action: "Meeting scheduled", time: "2 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Mode Active</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You&apos;re viewing a demonstration of the Alpha Edu Hub {role} dashboard. 
                      In a production environment, this would show real data from your school&apos;s database.
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/demo-login"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Try Different Role
                      </Link>
                      <a
                        href="https://www.linkedin.com/in/mahammad-bilal-hyder-493295356"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006097] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}