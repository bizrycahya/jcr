"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS: Record<string, string> = {
  Ringan: "#E4A6B0",
  Sedang: "#A73F52",
  Berat: "#681B2B",
};

export function PelanggaranChart({
  data,
}: {
  data: { tingkat: string; jumlah: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#681B2B14" />
        <XAxis dataKey="tingkat" tick={{ fill: "#681B2B99", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: "#681B2B66", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #681B2B1A", fontSize: 12 }} />
        <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} barSize={40}>
          {data.map((entry) => (
            <Cell key={entry.tingkat} fill={COLORS[entry.tingkat] ?? "#681B2B"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
