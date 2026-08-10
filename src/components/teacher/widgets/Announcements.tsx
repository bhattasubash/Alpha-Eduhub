import { Bell, Calendar, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
  author: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-600 border-red-200";
      case "medium":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "low":
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  const getPriorityLabel = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high":
        return "Important";
      case "medium":
        return "Update";
      case "low":
        return "Info";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
          <Button variant="ghost" size="sm" className="text-indigo-600">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No announcements at this time</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium border",
                          getPriorityColor(announcement.priority)
                        )}
                      >
                        {getPriorityLabel(announcement.priority)}
                      </span>
                      <h4 className="font-medium text-gray-900">
                        {announcement.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {announcement.date}
                  </div>
                  <span>by {announcement.author}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}