"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Props {
  schoolsByMonth:  { month: string; count: number }[];
  studentsByMonth: { month: string; count: number }[];
  teachersByMonth: { month: string; count: number }[];
  planData:        { name: string; value: number; color: string }[];
  statusData:      { name: string; value: number; color: string }[];
  topSchools:      { id: string; name: string; _count: { students: number; teachers: number } }[];
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1a1a2e",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.9)",
  },
  cursor: { stroke: "rgba(255,255,255,0.1)" },
};

const axisProps = {
  tick: { fill: "rgba(255,255,255,0.3)", fontSize: 11 },
  axisLine: false,
  tickLine: false,
};

export default function AnalyticsCharts({
  schoolsByMonth, studentsByMonth, teachersByMonth,
  planData, statusData, topSchools,
}: Props) {
  return (
    <div className="space-y-6">
      {/* School + Student Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">School Registrations (12 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={schoolsByMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="count" name="Schools" stroke="#8b5cf6" strokeWidth={2} fill="url(#schoolGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Student Enrollments (12 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={studentsByMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="count" name="Students" stroke="#3b82f6" strokeWidth={2} fill="url(#studentGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plans + Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Schools by Subscription Plan</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={planData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {planData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-shrink-0">
              {planData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-white/50 text-xs">{d.name}</span>
                  <span className="text-white/80 text-xs font-semibold ml-1">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Schools by Status</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-shrink-0">
              {statusData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-white/50 text-xs">{d.name}</span>
                  <span className="text-white/80 text-xs font-semibold ml-1">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top schools by students */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Top Schools by Student Count</h3>
        {topSchools.length === 0 ? (
          <p className="text-white/30 text-sm py-4">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={topSchools.map((s) => ({ name: s.name.slice(0, 20), students: s._count.students, teachers: s._count.teachers }))}
              margin={{ top: 5, right: 10, left: -20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" {...axisProps} angle={-30} textAnchor="end" interval={0} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }} />
              <Bar dataKey="students" name="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="teachers" name="Teachers" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
