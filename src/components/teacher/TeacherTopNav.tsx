"use client";

import { useState } from "react";
import {
  Search,
  Globe,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationBell from "@/components/shared/NotificationBell";

interface TeacherTopNavProps {
  onMobileMenuOpen: () => void;
  isMobileMenuOpen: boolean;
}

export default function TeacherTopNav({
  onMobileMenuOpen,
  isMobileMenuOpen,
}: TeacherTopNavProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuOpen}
            className="lg:hidden h-9 w-9 hover:bg-gray-100/80 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Search Bar */}
          <div className={cn(
            "flex items-center transition-all duration-300",
            showSearch ? "w-64 md:w-80" : "w-10 md:w-auto"
          )}>
            {!showSearch ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <div className="relative w-full animate-scale-in">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200/50 bg-gray-50/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-gray-200/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all hover-lift hidden md:flex"
          >
            <Globe className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <NotificationBell />

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all hover-lift hidden md:flex"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all hover-lift hidden md:flex"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200/50">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Mathematics Teacher</p>
            </div>
            <Avatar className="h-9 w-9 cursor-pointer transition-transform duration-200 hover:scale-110">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}