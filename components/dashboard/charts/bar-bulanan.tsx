"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// NOTE: data contoh untuk demo tampilan. Ganti dengan agregasi
// rata-rata CharacterScore per bulan dari Prisma.
const data = [
  { bulan: "Jul", rata: 3.1 },
  { bulan: "Agu", rata: 3.3 },
  { bulan: "Sep", rata: 3.4 },
  { bulan: "Okt", rata: 3.2 },
  { bulan: "Nov", rata: 3.5 },
  { bulan: "Des", rata: 3.6 },
];

export function BarBulanan() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#681B2B14" />
        <XAxis dataKey="bulan" tick={{ fill: "#681B2B99", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 4]} tick={{ fill: "#681B2B66", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #681B2B1A", fontSize: 12 }}
        />
        <Bar dataKey="rata" fill="#681B2B" radius={[6, 6, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
