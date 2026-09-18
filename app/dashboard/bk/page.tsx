import { ShieldAlert, ScrollText, FileText, Clock } from "lucide-react";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PelanggaranChart } from "@/components/dashboard/charts/pelanggaran-chart";

export default async function BkDashboardPage() {
  await requireRole(["BK", "SUPER_ADMIN"]);

  const [dibuka, proses, selesai, byTingkat, terbaru] = await Promise.all([
    prisma.violation.count({ where: { status: "DIBUKA" } }),
    prisma.violation.count({ where: { status: "PROSES" } }),
    prisma.violation.count({ where: { status: "SELESAI" } }),
    prisma.violation.groupBy({ by: ["tingkat"], _count: { tingkat: true } }),
    prisma.violation.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { student: true },
    }),
  ]);

  const cards = [
    { icon: ShieldAlert, label: "Kasus Dibuka", value: dibuka },
    { icon: Clock, label: "Dalam Proses", value: proses },
    { icon: ScrollText, label: "Selesai Dibina", value: selesai },
  ];

  const chartData = [
    { tingkat: "Ringan", jumlah: byTingkat.find((b) => b.tingkat === "RINGAN")?._count.tingkat ?? 0 },
    { tingkat: "Sedang", jumlah: byTingkat.find((b) => b.tingkat === "SEDANG")?._count.tingkat ?? 0 },
    { tingkat: "Berat", jumlah: byTingkat.find((b) => b.tingkat === "BERAT")?._count.tingkat ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-maroon-900">Dashboard BK</h1>
        <p className="text-sm text-maroon-800/50">Monitoring pembinaan dan pelanggaran siswa.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <ChartCard title="Grafik Pelanggaran" subtitle="Jumlah kasus berdasarkan tingkat">
        <PelanggaranChart data={chartData} />
      </ChartCard>

      <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-maroon-700" strokeWidth={1.6} />
          <h2 className="font-serif text-lg text-maroon-900">Kasus Terbaru</h2>
        </div>
        {terbaru.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Belum ada kasus"
            description="Kasus pelanggaran yang tercatat akan muncul di sini."
          />
        ) : (
          <ul className="divide-y divide-maroon-900/5">
            {terbaru.map((v) => (
              <li key={v.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-maroon-900">{v.student.nama}</p>
                  <p className="text-xs text-maroon-800/50">{v.jenis}</p>
                </div>
                <span className="rounded-full bg-maroon-50 px-2.5 py-1 text-xs text-maroon-700">
                  {v.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
