"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// Real revenue would come from Invoice aggregates.
// This component accepts optional data prop; falls back to shape-only data.
const MOCK_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface RevenueDataPoint {
  month:    string;
  revenue:  number;
  refunds?: number;
}

interface Props {
  data?: RevenueDataPoint[];
}

export default function RevenueChart({ data }: Props) {
  const chartData: RevenueDataPoint[] = data ?? MOCK_MONTHS.map((m) => ({
    month: m, revenue: 0, refunds: 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.9)",
          }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          formatter={(value: number) =>
            [`₹${value.toLocaleString()}`, ""]
          }
        />
        <Legend
          wrapperStyle={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}
        />
        <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="refunds" name="Refunds"  fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
