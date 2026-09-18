"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// NOTE: data contoh untuk demo tampilan. Ganti dengan hasil agregasi
// rata-rata CharacterScore per CharacterCategory dari Prisma.
const data = [
  { kategori: "Akhlak", nilai: 3.6 },
  { kategori: "Disiplin", nilai: 3.2 },
  { kategori: "Kepemimpinan", nilai: 3.4 },
  { kategori: "Akademik", nilai: 3.1 },
  { kategori: "Sosial", nilai: 3.7 },
];

export function RadarKarakter() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#681B2B22" />
        <PolarAngleAxis dataKey="kategori" tick={{ fill: "#681B2B", fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 4]} tick={{ fill: "#681B2B66", fontSize: 10 }} />
        <Radar
          dataKey="nilai"
          stroke="#D4AF37"
          fill="#D4AF37"
          fillOpacity={0.35}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
