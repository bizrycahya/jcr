"use client";

import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// NOTE: data contoh untuk demo tampilan. Ganti dengan agregasi
// rata-rata SemesterReport / MonthlyReport per bulan dari Prisma.
const data = [
  { bulan: "Jul", rata: 3.0 },
  { bulan: "Agu", rata: 3.15 },
  { bulan: "Sep", rata: 3.3 },
  { bulan: "Okt", rata: 3.25 },
  { bulan: "Nov", rata: 3.45 },
  { bulan: "Des", rata: 3.6 },
];

export function LineTrendSemester() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} stroke="#681B2B14" />
        <XAxis dataKey="bulan" tick={{ fill: "#681B2B99", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 4]} tick={{ fill: "#681B2B66", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #681B2B1A", fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="rata"
          stroke="#D4AF37"
          strokeWidth={2.5}
          dot={{ fill: "#D4AF37", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
