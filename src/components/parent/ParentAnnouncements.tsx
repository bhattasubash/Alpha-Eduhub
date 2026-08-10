"use client";

import { useState, useEffect } from "react";
import { Megaphone, Calendar } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  classId: number | null;
}

export default function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock announcements for now - this would be fetched from API
    setAnnouncements([
      {
        id: 1,
        title: "Parent-Teacher Meeting",
        description: "Scheduled for next Friday at 3 PM in the school auditorium.",
        date: new Date().toISOString(),
        classId: null,
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-3">Announcements</h2>
      {announcements.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No announcements</p>
      ) : (
        <div className="space-y-3">
          {announcements.slice(0, 3).map((announcement) => (
            <div
              key={announcement.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Megaphone className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{announcement.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{announcement.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
