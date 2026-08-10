"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SubjectResult {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  percentage: number;
  remarks?: string;
}

interface ExamPerformanceCardProps {
  exam: {
    id: number;
    title: string;
    date: string;
    overallPercentage: number;
    overallGrade: string;
    results: SubjectResult[];
  };
}

export default function ExamPerformanceCard({ exam }: ExamPerformanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                {exam.title}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span>{new Date(exam.date).toLocaleDateString()}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium">
                {exam.overallGrade}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {exam.overallPercentage}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Overall</div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
            <div className="space-y-3">
              {exam.results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                      {result.subject}
                    </div>
                    {result.remarks && (
                      <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {result.remarks}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-slate-50">
                        {result.marks}/{result.maxMarks}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        {result.percentage}%
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {result.grade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
