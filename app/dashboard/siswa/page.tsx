import { Award, ShieldAlert, ClipboardList } from "lucide-react";
import { requireRole, getCurrentSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { RadarKarakter } from "@/components/dashboard/charts/radar-karakter";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function SiswaDashboardPage() {
  await requireRole(["SISWA", "SUPER_ADMIN"]);
  const session = await getCurrentSession();

  const student = await prisma.student.findUnique({
    where: { userId: session!.user.id },
    include: {
      class: true,
      achievements: { orderBy: { tanggal: "desc" }, take: 5 },
      violations: { orderBy: { tanggal: "desc" }, take: 5 },
      scores: true,
    },
  });

  if (!student) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Profil siswa tidak ditemukan"
        description="Akun ini belum tertaut ke data siswa manapun."
      />
    );
  }

  const cards = [
    { icon: ClipboardList, label: "Total Penilaian", value: student.scores.length },
    { icon: Award, label: "Prestasi", value: student.achievements.length },
    { icon: ShieldAlert, label: "Pelanggaran", value: student.violations.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-maroon-800 font-serif text-2xl text-cream">
          {student.nama.charAt(0)}
        </span>
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">{student.nama}</h1>
          <p className="text-sm text-maroon-800/50">
            Kelas {student.class.nama} · NIS {student.nis}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <ChartCard title="Grafik Karakter Saya" subtitle="Rata-rata nilai per kategori">
        <RadarKarakter />
      </ChartCard>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-serif text-lg text-maroon-900">Prestasi Terbaru</h2>
          {student.achievements.length === 0 ? (
            <EmptyState icon={Award} title="Belum ada prestasi" description="Prestasi yang tercatat akan tampil di sini." />
          ) : (
            <ul className="divide-y divide-maroon-900/5">
              {student.achievements.map((a) => (
                <li key={a.id} className="py-3 text-sm">
                  <p className="text-maroon-900">{a.judul}</p>
                  <p className="text-xs text-maroon-800/50">{a.tingkat}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-maroon-900/8 bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-serif text-lg text-maroon-900">Riwayat Pelanggaran</h2>
          {student.violations.length === 0 ? (
            <EmptyState icon={ShieldAlert} title="Tidak ada pelanggaran" description="Catatan pelanggaran akan tampil di sini." />
          ) : (
            <ul className="divide-y divide-maroon-900/5">
              {student.violations.map((v) => (
                <li key={v.id} className="py-3 text-sm">
                  <p className="text-maroon-900">{v.jenis}</p>
                  <p className="text-xs text-maroon-800/50">{v.tingkat} · {v.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
