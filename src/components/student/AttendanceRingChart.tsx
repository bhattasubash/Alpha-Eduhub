"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AttendanceRingChartProps {
  percentage: number;
  size?: number;
}

export default function AttendanceRingChart({ percentage, size = 200 }: AttendanceRingChartProps) {
  const data = [
    { name: "Present", value: percentage, fill: "#10b981" },
    { name: "Absent", value: 100 - percentage, fill: "#e2e8f0" },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {percentage}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Attendance</div>
        </div>
      </div>
    </div>
  );
}
