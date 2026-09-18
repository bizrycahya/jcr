import { GraduationCap, Layers, Award, ShieldAlert, Download } from "lucide-react";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { RadarKarakter } from "@/components/dashboard/charts/radar-karakter";
import { PieDistribusi } from "@/components/dashboard/charts/pie-distribusi";

export default async function KepalaSekolahDashboardPage() {
  await requireRole(["KEPALA_SEKOLAH", "SUPER_ADMIN"]);

  const [totalSiswa, totalKelas, totalPrestasi, totalPelanggaran] = await Promise.all([
    prisma.student.count({ where: { status: "AKTIF" } }),
    prisma.class.count(),
    prisma.achievement.count(),
    prisma.violation.count(),
  ]);

  const cards = [
    { icon: GraduationCap, label: "Total Siswa", value: totalSiswa },
    { icon: Layers, label: "Total Kelas", value: totalKelas },
    { icon: Award, label: "Total Prestasi", value: totalPrestasi },
    { icon: ShieldAlert, label: "Total Pelanggaran", value: totalPelanggaran },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Dashboard Kepala Sekolah</h1>
          <p className="text-sm text-maroon-800/50">
            Tampilan hanya-lihat — rekap menyeluruh perkembangan karakter siswa.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-maroon-800 px-5 py-2.5 text-sm text-cream hover:bg-maroon-900">
          <Download className="h-4 w-4" />
          Unduh Semua Laporan
        </button>
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
        <ChartCard title="Distribusi Predikat" subtitle="Sebaran predikat seluruh siswa">
          <PieDistribusi />
        </ChartCard>
      </div>
    </div>
  );
}
