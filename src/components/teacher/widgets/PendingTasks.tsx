import { ClipboardCheck, BookOpen, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  type: "attendance" | "homework" | "marks" | "exam";
  title: string;
  count: number;
  urgent: boolean;
}

interface PendingTasksProps {
  tasks: Task[];
}

export default function PendingTasks({ tasks }: PendingTasksProps) {
  const getTaskIcon = (type: Task["type"]) => {
    switch (type) {
      case "attendance":
        return ClipboardCheck;
      case "homework":
        return BookOpen;
      case "marks":
        return FileText;
      case "exam":
        return Calendar;
    }
  };

  const getTaskColor = (type: Task["type"]) => {
    switch (type) {
      case "attendance":
        return "bg-green-50 text-green-600";
      case "homework":
        return "bg-blue-50 text-blue-600";
      case "marks":
        return "bg-orange-50 text-orange-600";
      case "exam":
        return "bg-purple-50 text-purple-600";
    }
  };

  const getTaskLabel = (type: Task["type"]) => {
    switch (type) {
      case "attendance":
        return "Attendance";
      case "homework":
        return "Homework";
      case "marks":
        return "Marks";
      case "exam":
        return "Exams";
    }
  };

  return (
    <Card className="h-full animate-fade-in hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
          <Button variant="ghost" size="sm" className="text-indigo-600">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">All caught up! No pending tasks</p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const Icon = getTaskIcon(task.type);
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border border-gray-100 transition-all duration-200 hover-lift animate-slide-up cursor-pointer",
                    task.urgent && "bg-red-50/50 border-red-200"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 hover:scale-110",
                      getTaskColor(task.type)
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {getTaskLabel(task.type)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {task.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-lg font-bold",
                          task.urgent ? "text-red-600" : "text-gray-900"
                        )}
                      >
                        {task.count}
                      </span>
                      {task.urgent && (
                        <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">pending</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}