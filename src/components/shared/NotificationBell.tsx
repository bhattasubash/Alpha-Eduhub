"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: any;
}

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ATTENDANCE_ABSENT":
      case "ATTENDANCE_THRESHOLD":
        return "📅";
      case "MARKS_PUBLISHED":
      case "EXAM_RESULT_PUBLISHED":
        return "📊";
      case "ASSIGNMENT_CREATED":
      case "ASSIGNMENT_GRADED":
        return "📝";
      case "LEAVE_SUBMITTED":
      case "LEAVE_APPROVED":
      case "LEAVE_REJECTED":
        return "🏖️";
      case "NEW_MESSAGE":
        return "💬";
      case "NEW_ANNOUNCEMENT":
      case "SCHOOL_ANNOUNCEMENT":
        return "📢";
      case "FEE_INVOICE":
      case "FEE_PAYMENT":
      case "FEE_DUE":
        return "💰";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ATTENDANCE_ABSENT":
      case "ATTENDANCE_THRESHOLD":
        return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800";
      case "MARKS_PUBLISHED":
      case "EXAM_RESULT_PUBLISHED":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
      case "ASSIGNMENT_CREATED":
      case "ASSIGNMENT_GRADED":
        return "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800";
      case "LEAVE_SUBMITTED":
      case "LEAVE_APPROVED":
      case "LEAVE_REJECTED":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
      case "NEW_MESSAGE":
        return "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800";
      case "NEW_ANNOUNCEMENT":
      case "SCHOOL_ANNOUNCEMENT":
        return "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800";
      case "FEE_INVOICE":
      case "FEE_PAYMENT":
      case "FEE_DUE":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      default:
        return "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 transition-all hover-lift relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-96 max-h-[500px] z-50 border-slate-200 dark:border-slate-700 shadow-xl">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs gap-1"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer",
                        !notification.isRead && "bg-slate-50 dark:bg-slate-800"
                      )}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-50">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
