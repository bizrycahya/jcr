import {
  GraduationCap,
  UserSquare2,
  Users,
  ClipboardList,
  Layers,
  ShieldAlert,
  Award,
  UserCog,
} from "lucide-react";

import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { RadarKarakter } from "@/components/dashboard/charts/radar-karakter";
import { BarBulanan } from "@/components/dashboard/charts/bar-bulanan";
import { PieDistribusi } from "@/components/dashboard/charts/pie-distribusi";
import { HeatmapPenilaian } from "@/components/dashboard/charts/heatmap-penilaian";
import { LineTrendSemester } from "@/components/dashboard/charts/line-trend-semester";

export default async function SuperAdminDashboardPage() {
  await requireRole(["SUPER_ADMIN"]);

  const [
    totalSiswa,
    totalGuru,
    totalOrangTua,
    totalPenilaian,
    totalKelas,
    totalBk,
    totalPrestasi,
    totalPelanggaran,
  ] = await Promise.all([
    prisma.student.count({ where: { status: "AKTIF" } }),
    prisma.teacher.count({ where: { status: "AKTIF" } }),
    prisma.parent.count(),
    prisma.characterScore.count(),
    prisma.class.count(),
    prisma.user.count({ where: { role: "BK", status: "AKTIF" } }),
    prisma.achievement.count(),
    prisma.violation.count(),
  ]);

  const cards = [
    { icon: GraduationCap, label: "Total Siswa", value: totalSiswa },
    { icon: UserSquare2, label: "Total Guru", value: totalGuru },
    { icon: Users, label: "Total Orang Tua", value: totalOrangTua },
    { icon: ClipboardList, label: "Total Penilaian", value: totalPenilaian },
    { icon: Layers, label: "Total Kelas", value: totalKelas },
    { icon: UserCog, label: "Total BK", value: totalBk },
    { icon: Award, label: "Total Prestasi", value: totalPrestasi },
    { icon: ShieldAlert, label: "Total Pelanggaran", value: totalPelanggaran },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Dashboard Super Admin</h1>
        <p className="text-sm text-maroon-800/50">
          Ringkasan menyeluruh data dan perkembangan karakter siswa JaNIC.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Radar Karakter" subtitle="Rata-rata seluruh siswa per kategori">
          <RadarKarakter />
        </ChartCard>
        <ChartCard title="Rata-rata Bulanan" subtitle="Tren nilai karakter per bulan">
          <BarBulanan />
        </ChartCard>
        <ChartCard title="Distribusi Predikat" subtitle="Sebaran predikat seluruh siswa">
          <PieDistribusi />
        </ChartCard>
        <ChartCard title="Tren Semester" subtitle="Rata-rata nilai sepanjang semester berjalan">
          <LineTrendSemester />
        </ChartCard>
      </div>

      <ChartCard title="Heatmap Penilaian" subtitle="Intensitas rata-rata nilai per kategori & bulan">
        <HeatmapPenilaian />
      </ChartCard>
    </div>
  );
}
