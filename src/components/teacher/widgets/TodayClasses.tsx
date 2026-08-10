import { Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Class {
  id: number;
  subject: string;
  className: string;
  time: string;
  room: string;
  students: number;
  status: "upcoming" | "ongoing" | "completed";
}

interface TodayClassesProps {
  classes: Class[];
}

export default function TodayClasses({ classes }: TodayClassesProps) {
  const getStatusColor = (status: Class["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-700";
      case "ongoing":
        return "bg-green-50 text-green-700";
      case "completed":
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: Class["status"]) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Now";
      case "completed":
        return "Completed";
    }
  };

  return (
    <Card className="h-full animate-fade-in hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Today&apos;s Classes</CardTitle>
          <Button variant="ghost" size="sm" className="text-indigo-600">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No classes scheduled for today</p>
            </div>
          ) : (
            classes.map((classItem, index) => (
              <div
                key={classItem.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border border-gray-100 transition-all duration-200 hover-lift animate-slide-up",
                  classItem.status === "ongoing" && "bg-green-50/50 border-green-200"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {classItem.subject}
                    </h4>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getStatusColor(classItem.status)
                      )}
                    >
                      {getStatusText(classItem.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Class {classItem.className}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    {classItem.time}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {classItem.room}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}