"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  Settings,
  Shield,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Megaphone,
  Monitor,
  Blocks,
  Receipt,
  Radio,
  HardDrive,
  ShieldCheck,
  Globe,
  Book,
  Calendar,
} from "lucide-react";

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/super-admin",              icon: LayoutDashboard, label: "Dashboard"      },
      { href: "/super-admin/analytics",    icon: BarChart3,       label: "Analytics"      },
      { href: "/super-admin/monitoring",   icon: Monitor,         label: "Monitoring"     },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { href: "/super-admin/schools",      icon: Building2,       label: "Schools"        },
      { href: "/super-admin/users",        icon: Users,           label: "Users"          },
      { href: "/super-admin/subscriptions",icon: CreditCard,      label: "Subscriptions"  },
      { href: "/super-admin/modules",      icon: Blocks,          label: "Modules"        },
      { href: "/super-admin/billing",      icon: Receipt,         label: "Billing"        },
    ],
  },
  {
    label: "SALES",
    items: [
      { href: "/super-admin/demo-requests",icon: Calendar,        label: "Demo Requests"  },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      { href: "/super-admin/support",      icon: HeadphonesIcon,  label: "Support"        },
      { href: "/super-admin/broadcasts",   icon: Radio,           label: "Broadcasts"     },
      { href: "/super-admin/knowledge-base",icon: Book,           label: "Knowledge Base" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/super-admin/audit",        icon: ScrollText,      label: "Audit Logs"     },
      { href: "/super-admin/settings",     icon: Settings,        label: "Settings"       },
      { href: "/super-admin/security",     icon: ShieldCheck,     label: "Security"       },
      { href: "/super-admin/backups",      icon: HardDrive,       label: "Backups"        },
      { href: "/super-admin/localization", icon: Globe,           label: "Localization"   },
    ],
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string) {
    if (href === "/super-admin") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div className="lg:hidden fixed inset-0 z-20 bg-black/50 hidden" id="sidebar-overlay" />

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full flex flex-col
          bg-[#0d0d1a] border-r border-white/5
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">Alpha Edu</p>
              <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-wider">Super Admin</p>
            </div>
          )}
        </div>

        {/* Super Admin Badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-purple-300 text-xs font-semibold">Platform Owner</p>
              <p className="text-purple-400/60 text-[10px]">Full Access</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ href, icon: Icon, label }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      title={collapsed ? label : undefined}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-150 group
                        ${active
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                          : "text-white/40 hover:text-white/80 hover:bg-white/5"
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-purple-400" : "group-hover:text-white/70"}`} />
                      {!collapsed && <span className="truncate">{label}</span>}
                      {active && !collapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-2 space-y-0.5">
          <button
            onClick={() => {
              fetch("/api/auth/logout", { method: "POST", credentials: "include" })
                .catch(() => console.log("Logout failed"));
              window.location.href = "/sign-in";
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-[#252540] transition-all shadow-lg"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}
