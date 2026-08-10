"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AcademicPerformanceChartProps {
  data: {
    date: string;
    examName: string;
    percentage: number;
  }[];
}

export default function AcademicPerformanceChart({ data }: AcademicPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
        <p className="text-sm">No performance data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="date"
            className="text-xs text-slate-600 dark:text-slate-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            className="text-xs text-slate-600 dark:text-slate-400"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#1e293b" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Performance %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
