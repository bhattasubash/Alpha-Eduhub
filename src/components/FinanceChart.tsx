"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Jan", income: 4200, expense: 2400 },
  { name: "Feb", income: 3800, expense: 2100 },
  { name: "Mar", income: 4900, expense: 2800 },
  { name: "Apr", income: 4600, expense: 2900 },
  { name: "May", income: 5100, expense: 3100 },
  { name: "Jun", income: 5800, expense: 3400 },
  { name: "Jul", income: 5400, expense: 3200 },
  { name: "Aug", income: 6100, expense: 3600 },
  { name: "Sep", income: 6800, expense: 3900 },
  { name: "Oct", income: 7200, expense: 4100 },
  { name: "Nov", income: 7600, expense: 4300 },
  { name: "Dec", income: 8400, expense: 4600 },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Financial Overview</h2>
          <p className="text-xs text-slate-500">Revenue vs Operating Expenditures</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+14.2% YoY</span>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickLine={false}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
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
              formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend
              align="right"
              verticalAlign="top"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: "16px", fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Tuition & Inflow"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#2563EB" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Operational Expense"
              stroke="#E11D48"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#E11D48" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
