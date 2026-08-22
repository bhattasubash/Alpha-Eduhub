"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { ArrowLeft, Megaphone, Calendar } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  classId: number | null;
  createdById: string | null;
  createdByRole: string | null;
  expiryDate: string | null;
  status: string;
}

export default function AnnouncementsPage({
  params,
}: {
  params: { studentId: string };
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.studentId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/parent/children/${params.studentId}/announcements`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/parent"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-600">View school and class announcements</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {announcements.length} {announcements.length === 1 ? "Announcement" : "Announcements"}
        </h2>
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No announcements available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {announcement.title}
                      </h3>
                      {announcement.classId && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Class Specific
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{announcement.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                      {announcement.expiryDate && (
                        <div className="flex items-center gap-1">
                          <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {announcement.createdByRole && (
                        <div className="flex items-center gap-1">
                          <span>By: {announcement.createdByRole}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
