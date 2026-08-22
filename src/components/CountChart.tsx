"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const total = boys + girls;
  const data = [
    {
      name: "Total",
      count: total,
      fill: "#F1F5F9", // slate-100 background ring
    },
    {
      name: "Girls",
      count: girls,
      fill: "#0D9488", // teal-600
    },
    {
      name: "Boys",
      count: boys,
      fill: "#2563EB", // blue-600
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="100%"
          barSize={26}
          data={data}
        >
          <RadialBar background={{ fill: "#F8FAFC" }} dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
        <Users className="w-6 h-6 text-slate-500 mb-0.5" strokeWidth={1.75} />
        <span className="text-xs font-bold text-slate-800 tabular-nums">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CountChart;
