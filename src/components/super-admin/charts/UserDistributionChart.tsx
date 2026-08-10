"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface DataPoint {
  name:  string;
  value: number;
  color: string;
}

interface Props {
  data: DataPoint[];
}

export default function UserDistributionChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.9)",
            }}
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} (${Math.round((value / Math.max(total, 1)) * 100)}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-white/50 text-xs">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-xs font-semibold">
                {d.value.toLocaleString()}
              </span>
              <span className="text-white/30 text-xs">
                {Math.round((d.value / Math.max(total, 1)) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
