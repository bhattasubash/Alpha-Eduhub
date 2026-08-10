"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, AlertTriangle, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Task = {
  id: number;
  title: string;
  description: string;
  type: "attendance" | "marks" | "homework" | "exam" | "meeting" | "custom";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  dueTime?: string;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Mark attendance for Class 10A",
      description: "Complete attendance for morning session",
      type: "attendance",
      priority: "urgent",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "10:00",
      completed: false,
    },
    {
      id: 2,
      title: "Review homework submissions",
      description: "Grade and provide feedback on math assignments",
      type: "homework",
      priority: "high",
      dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      completed: false,
    },
    {
      id: 3,
      title: "Prepare exam paper",
      description: "Create midterm examination for Physics",
      type: "exam",
      priority: "medium",
      dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      completed: false,
    },
  ]);

  const toggleComplete = (taskId: number) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Stay organized with your to-do list</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.filter(t => !t.completed).length}</p>
              </div>
              <Circle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.filter(t => t.completed).length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Urgent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.filter(t => t.priority === "urgent" && !t.completed).length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  task.completed
                    ? "border-gray-200 opacity-60 bg-gray-50"
                    : "border-gray-200 hover:shadow-md bg-white"
                }`}
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-900 dark:text-white"}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-600 dark:text-gray-400"}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {task.dueTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.dueTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}