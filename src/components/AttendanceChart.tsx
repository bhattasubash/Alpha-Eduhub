"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#64748B", fontSize: 12 }}
          tickLine={false}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "#64748B", fontSize: 12 }}
          tickLine={false}
          dx={-6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            borderColor: "#E2E8F0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            fontSize: "12px",
            fontWeight: 500,
          }}
        />
        <Legend
          align="right"
          verticalAlign="top"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: "8px", paddingBottom: "24px", fontSize: "12px", color: "#475569" }}
        />
        <Bar
          dataKey="present"
          name="Present"
          fill="#2563EB"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="absent"
          name="Absent"
          fill="#94A3B8"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
