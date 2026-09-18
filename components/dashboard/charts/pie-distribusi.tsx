"use client";

import { Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

// NOTE: data contoh untuk demo tampilan. Ganti dengan hitungan jumlah
// siswa per predikat (Kurang/Cukup/Baik/Sangat Baik) dari Prisma.
const data = [
  { name: "Sangat Baik", value: 42, color: "#D4AF37" },
  { name: "Baik", value: 38, color: "#681B2B" },
  { name: "Cukup", value: 15, color: "#A73F52" },
  { name: "Kurang", value: 5, color: "#E4A6B0" },
];

export function PieDistribusi() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #681B2B1A", fontSize: 12 }} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: "#681B2B99" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
